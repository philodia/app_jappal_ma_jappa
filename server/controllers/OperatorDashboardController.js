const Dashboard = require('../models/OperatorDashboard');
const Client = require('../models/Client');
const Credit = require('../models/Credit');

const OperatorDashboardController = {
  // Obtenir le tableau de bord de l'opérateur
  getDashboard: async (req, res) => {
    try {
      const operatorId = req.user.id; // Supposant que l'ID de l'utilisateur est disponible dans req.user après authentification
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Récupérer ou créer le tableau de bord pour aujourd'hui
      let dashboard = await Dashboard.findOne({ operator: operatorId, date: today });

      if (!dashboard) {
        // Si le tableau de bord n'existe pas pour aujourd'hui, le créer avec les données actuelles
        const totalClients = await Client.countDocuments({ createdBy: operatorId });
        const activeClients = await Client.countDocuments({ createdBy: operatorId, isActive: true });
        const totalCredits = await Credit.countDocuments({ operator: operatorId });
        const activeCredits = await Credit.countDocuments({ operator: operatorId, status: 'active' });
        const creditAggregation = await Credit.aggregate([
          { $match: { operator: operatorId } },
          { $group: {
              _id: null,
              totalCreditAmount: { $sum: '$amount' },
              totalRepaidAmount: { $sum: '$totalRepaid' },
              totalOutstandingAmount: { $sum: { $subtract: ['$amount', '$totalRepaid'] } }
            }
          }
        ]);

        const creditsByStatus = await Credit.aggregate([
          { $match: { operator: operatorId } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const recentActivity = await Credit.find({ operator: operatorId })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('status createdAt client amount')
          .populate('client', 'firstName lastName');

        dashboard = new Dashboard({
          operator: operatorId,
          date: today,
          totalClients,
          activeClients,
          totalCredits,
          activeCredits,
          ...(creditAggregation[0] || {}),
          creditsByStatus: creditsByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          recentActivity: recentActivity.map(credit => ({
            type: credit.status === 'approved' ? 'newCredit' : 'repayment',
            date: credit.createdAt,
            description: `${credit.client.firstName} ${credit.client.lastName} - ${credit.amount}`,
            relatedId: credit._id
          }))
        });

        await dashboard.save();
      }

      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord', error: error.message });
    }
  },

  // Mettre à jour une activité récente
  updateRecentActivity: async (req, res) => {
    try {
      const { type, description, relatedId } = req.body;
      const operatorId = req.user.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dashboard = await Dashboard.findOne({ operator: operatorId, date: today });

      if (!dashboard) {
        return res.status(404).json({ message: 'Tableau de bord non trouvé pour aujourd\'hui' });
      }

      dashboard.recentActivity.unshift({
        type,
        date: new Date(),
        description,
        relatedId
      });

      if (dashboard.recentActivity.length > 10) {
        dashboard.recentActivity.pop();
      }

      await dashboard.save();

      res.json(dashboard.recentActivity);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'activité récente', error: error.message });
    }
  }
};

module.exports = OperatorDashboardController;
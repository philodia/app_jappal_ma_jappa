const AdminDashboard = require('../models/AdminDashboard');
const User = require('../models/User');
const Client = require('../models/Client');
const Credit = require('../models/Credit');

const AdminDashboardController = {
  // Obtenir le tableau de bord administrateur
  getDashboard: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Récupérer ou créer le tableau de bord pour aujourd'hui
      let dashboard = await AdminDashboard.findOne({ date: today });

      if (!dashboard) {
        // Si le tableau de bord n'existe pas pour aujourd'hui, le créer avec les données actuelles
        const [
          totalOperators,
          activeOperators,
          totalClients,
          activeClients,
          totalCredits,
          activeCredits,
          creditAggregation,
          creditsByStatus
        ] = await Promise.all([
          User.countDocuments({ role: 'operator' }),
          User.countDocuments({ role: 'operator', isActive: true }),
          Client.countDocuments(),
          Client.countDocuments({ isActive: true }),
          Credit.countDocuments(),
          Credit.countDocuments({ status: 'active' }),
          Credit.aggregate([
            { $group: {
                _id: null,
                totalCreditAmount: { $sum: '$amount' },
                totalRepaidAmount: { $sum: '$totalRepaid' },
                totalOutstandingAmount: { $sum: { $subtract: ['$amount', '$totalRepaid'] } }
              }
            }
          ]),
          Credit.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ])
        ]);

        const operatorPerformance = await User.aggregate([
          { $match: { role: 'operator' } },
          { $lookup: {
              from: 'clients',
              localField: '_id',
              foreignField: 'createdBy',
              as: 'clients'
            }
          },
          { $lookup: {
              from: 'credits',
              localField: '_id',
              foreignField: 'operator',
              as: 'credits'
            }
          },
          { $project: {
              _id: 1,
              totalClients: { $size: '$clients' },
              activeClients: { 
                $size: { 
                  $filter: { 
                    input: '$clients', 
                    as: 'client', 
                    cond: { $eq: ['$$client.isActive', true] } 
                  } 
                } 
              },
              totalCredits: { $size: '$credits' },
              activeCredits: { 
                $size: { 
                  $filter: { 
                    input: '$credits', 
                    as: 'credit', 
                    cond: { $eq: ['$$credit.status', 'active'] } 
                  } 
                } 
              },
              totalCreditAmount: { $sum: '$credits.amount' },
              totalRepaidAmount: { $sum: '$credits.totalRepaid' }
            }
          }
        ]);

        dashboard = new AdminDashboard({
          date: today,
          totalOperators,
          activeOperators,
          totalClients,
          activeClients,
          totalCredits,
          activeCredits,
          ...(creditAggregation[0] || {}),
          creditsByStatus: creditsByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          operatorPerformance
        });

        await dashboard.save();
      }

      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord administrateur', error: error.message });
    }
  },

  // Mettre à jour une activité récente
  updateRecentActivity: async (req, res) => {
    try {
      const { type, description, relatedId, operatorId } = req.body;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dashboard = await AdminDashboard.findOne({ date: today });

      if (!dashboard) {
        return res.status(404).json({ message: 'Tableau de bord non trouvé pour aujourd\'hui' });
      }

      dashboard.recentActivity.unshift({
        type,
        date: new Date(),
        description,
        relatedId,
        operator: operatorId
      });

      if (dashboard.recentActivity.length > 20) {
        dashboard.recentActivity.pop();
      }

      await dashboard.save();

      res.json(dashboard.recentActivity);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'activité récente', error: error.message });
    }
  }
};

module.exports = AdminDashboardController;
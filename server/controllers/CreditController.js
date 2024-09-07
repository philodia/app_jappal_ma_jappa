const Credit = require('../models/Credit');

const CreditController = {
  // Créer un nouveau crédit
  createCredit: async (req, res) => {
    try {
      const newCredit = new Credit({
        ...req.body,
        operator: req.user.id // Supposant que l'ID de l'utilisateur est disponible dans req.user après authentification
      });
      await newCredit.save();
      res.status(201).json(newCredit);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la création du crédit', error: error.message });
    }
  },

  // Obtenir tous les crédits
  getAllCredits: async (req, res) => {
    try {
      const credits = await Credit.find({ operator: req.user.id })
                                  .populate('client', 'firstName lastName');
      res.json(credits);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des crédits', error: error.message });
    }
  },

  // Obtenir un crédit par ID
  getCreditById: async (req, res) => {
    try {
      const credit = await Credit.findOne({ _id: req.params.id, operator: req.user.id })
                                 .populate('client', 'firstName lastName');
      if (!credit) {
        return res.status(404).json({ message: 'Crédit non trouvé' });
      }
      res.json(credit);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du crédit', error: error.message });
    }
  },

  // Mettre à jour un crédit
  updateCredit: async (req, res) => {
    try {
      const updatedCredit = await Credit.findOneAndUpdate(
        { _id: req.params.id, operator: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedCredit) {
        return res.status(404).json({ message: 'Crédit non trouvé' });
      }
      res.json(updatedCredit);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la mise à jour du crédit', error: error.message });
    }
  },

  // Approuver un crédit
  approveCredit: async (req, res) => {
    try {
      const credit = await Credit.findOneAndUpdate(
        { _id: req.params.id, operator: req.user.id, status: 'pending' },
        { status: 'approved' },
        { new: true }
      );
      if (!credit) {
        return res.status(404).json({ message: 'Crédit non trouvé ou déjà approuvé' });
      }
      res.json(credit);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de l\'approbation du crédit', error: error.message });
    }
  },

  // Enregistrer un remboursement
  recordRepayment: async (req, res) => {
    try {
      const { amount, paidDate } = req.body;
      const credit = await Credit.findOne({ _id: req.params.id, operator: req.user.id });
      if (!credit) {
        return res.status(404).json({ message: 'Crédit non trouvé' });
      }

      const repaymentIndex = credit.repayments.findIndex(r => r.status === 'pending');
      if (repaymentIndex === -1) {
        return res.status(400).json({ message: 'Aucun remboursement en attente' });
      }

      credit.repayments[repaymentIndex].status = 'paid';
      credit.repayments[repaymentIndex].paidDate = paidDate;
      credit.repayments[repaymentIndex].paidAmount = amount;
      credit.totalRepaid += amount;

      if (credit.totalRepaid >= credit.totalAmount) {
        credit.status = 'completed';
      }

      await credit.save();
      res.json(credit);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de l\'enregistrement du remboursement', error: error.message });
    }
  }
};

module.exports = CreditController;
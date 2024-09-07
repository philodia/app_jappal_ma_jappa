const express = require('express');
const router = express.Router();
const CreditController = require('../controllers/CreditController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes sont protégées par le middleware d'authentification
router.use(authMiddleware);

// Créer un nouveau crédit
router.post('/', CreditController.createCredit);

// Obtenir tous les crédits
router.get('/', CreditController.getAllCredits);

// Obtenir un crédit spécifique
router.get('/:id', CreditController.getCreditById);

// Mettre à jour un crédit
router.put('/:id', CreditController.updateCredit);

// Approuver un crédit
router.patch('/:id/approve', CreditController.approveCredit);

// Enregistrer un remboursement
router.post('/:id/repayment', CreditController.recordRepayment);

module.exports = router;
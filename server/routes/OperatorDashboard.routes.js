const express = require('express');
const router = express.Router();
const OperatorDashboardController = require('../controllers/OperatorDashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes sont protégées par le middleware d'authentification
router.use(authMiddleware);

// Obtenir le tableau de bord de l'opérateur
router.get('/', OperatorDashboardController.getDashboard);

// Mettre à jour une activité récente
router.post('/activity', OperatorDashboardController.updateRecentActivity);

module.exports = router;
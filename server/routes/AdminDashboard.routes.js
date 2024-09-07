const express = require('express');
const router = express.Router();
const AdminDashboardController = require('../controllers/AdminDashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Toutes les routes sont protégées par le middleware d'authentification et d'administration
router.use(authMiddleware, adminMiddleware);

// Obtenir le tableau de bord administrateur
router.get('/', AdminDashboardController.getDashboard);

// Mettre à jour une activité récente
router.post('/activity', AdminDashboardController.updateRecentActivity);

module.exports = router;
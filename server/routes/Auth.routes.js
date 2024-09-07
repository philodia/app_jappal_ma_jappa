const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route pour l'inscription
router.post('/register', AuthController.register);

// Route pour la connexion
router.post('/login', AuthController.login);

// Route pour obtenir le profil (protégée)
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateClientMiddleware = require('../middlewares/validateClientMiddleware');

// Toutes les routes sont protégées par le middleware d'authentification
router.use(authMiddleware);

// Créer un nouveau client
router.post('/', 
    roleMiddleware(['operator', 'admin']), 
    validateClientMiddleware, 
    ClientController.createClient
);

// Obtenir tous les clients
router.get('/', 
    roleMiddleware(['operator', 'admin']), 
    ClientController.getAllClients
);

// Obtenir un client spécifique
router.get('/:id', 
    roleMiddleware(['operator', 'admin']), 
    ClientController.getClientById
);

// Mettre à jour un client
router.put('/:id', 
    roleMiddleware(['operator', 'admin']), 
    validateClientMiddleware, 
    ClientController.updateClient
);

// Supprimer (désactiver) un client
router.delete('/:id', 
    roleMiddleware(['admin']), 
    ClientController.deleteClient
);

module.exports = router;
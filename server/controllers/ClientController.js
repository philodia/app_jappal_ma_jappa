const Client = require('../models/Client');

const ClientController = {
  // Créer un nouveau client
  createClient: async (req, res) => {
    try {
      const newClient = new Client({
        ...req.body,
        createdBy: req.user.id // Supposant que l'ID de l'utilisateur est disponible dans req.user après authentification
      });
      await newClient.save();
      res.status(201).json(newClient);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la création du client', error: error.message });
    }
  },

  // Obtenir tous les clients
  getAllClients: async (req, res) => {
    try {
      const clients = await Client.find({ createdBy: req.user.id });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: error.message });
    }
  },

  // Obtenir un client par ID
  getClientById: async (req, res) => {
    try {
      const client = await Client.findOne({ _id: req.params.id, createdBy: req.user.id });
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du client', error: error.message });
    }
  },

  // Mettre à jour un client
  updateClient: async (req, res) => {
    try {
      const updatedClient = await Client.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.json(updatedClient);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la mise à jour du client', error: error.message });
    }
  },

  // Supprimer un client (ou le désactiver)
  deleteClient: async (req, res) => {
    try {
      const client = await Client.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        { isActive: false },
        { new: true }
      );
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.json({ message: 'Client désactivé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du client', error: error.message });
    }
  }
};

module.exports = ClientController;
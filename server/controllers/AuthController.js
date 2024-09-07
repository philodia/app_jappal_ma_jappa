const User = require('../models/User');
const jwt = require('jsonwebtoken');

const AuthController = {
  // Inscription d'un nouvel utilisateur
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, role, phoneNumber } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Créer un nouvel utilisateur
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        phoneNumber
      });

      // Sauvegarder l'utilisateur
      await newUser.save();

      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
  },

  // Connexion d'un utilisateur
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Créer et envoyer le token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Mettre à jour la dernière connexion
      user.lastLogin = Date.now();
      await user.save();

      res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
  },

  // Obtenir le profil de l'utilisateur connecté
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
    }
  }
};

module.exports = AuthController;
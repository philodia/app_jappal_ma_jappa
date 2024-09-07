// server.js

// Importer les modules nécessaires
const express = require('express');
const cors = require("cors");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, 'config', '.env') });
require("./config/db");

// Importer les routes
const authRoutes = require('./routes/Auth.routes');
const clientRoutes = require('./routes/Client.routes');
const creditRoutes = require('./routes/Credit.routes');
const operatorDashboardRoutes = require('./routes/OperatorDashboard.routes');
const adminDashboardRoutes = require('./routes/AdminDashboard.routes');

// Importer les middlewares
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');
const validateClientMiddleware = require('./middlewares/validateClientMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

// Créer une instance d'Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/credits', authMiddleware, creditRoutes);
app.use('/api/admindashboard', authMiddleware, adminMiddleware, adminDashboardRoutes);
app.use('/api/operatordashboard', authMiddleware, roleMiddleware(['operator', 'admin']), operatorDashboardRoutes);

// Routes spécifiques
app.post('/api/clients', authMiddleware, validateClientMiddleware, (req, res) => {
    // Logique pour créer un client
});

app.put('/api/clients/:id', authMiddleware, validateClientMiddleware, (req, res) => {
    // Logique pour mettre à jour un client
});

app.get('/api/admin-only', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    // Logique pour route accessible uniquement aux administrateurs
});

app.get('/api/operator-and-admin', authMiddleware, roleMiddleware(['operator', 'admin']), (req, res) => {
    // Logique pour route accessible aux opérateurs et aux administrateurs
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API de JAPPAL MA JAPPA" });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue!');
});

// Écouter le serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur JAPPAL MA JAPPA en cours d'exécution sur le port ${port}`);
});
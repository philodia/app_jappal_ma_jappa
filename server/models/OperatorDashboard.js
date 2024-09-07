const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalClients: {
    type: Number,
    default: 0
  },
  activeClients: {
    type: Number,
    default: 0
  },
  totalCredits: {
    type: Number,
    default: 0
  },
  activeCredits: {
    type: Number,
    default: 0
  },
  totalCreditAmount: {
    type: Number,
    default: 0
  },
  totalRepaidAmount: {
    type: Number,
    default: 0
  },
  totalOutstandingAmount: {
    type: Number,
    default: 0
  },
  creditsByStatus: {
    pending: { type: Number, default: 0 },
    approved: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    defaulted: { type: Number, default: 0 }
  },
  recentActivity: [{
    type: {
      type: String,
      enum: ['newClient', 'newCredit', 'repayment', 'creditCompleted', 'creditDefaulted']
    },
    date: Date,
    description: String,
    relatedId: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
dashboardSchema.index({ operator: 1, date: -1 });

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;
const mongoose = require('mongoose');

const adminDashboardSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    unique: true
  },
  totalOperators: {
    type: Number,
    default: 0
  },
  activeOperators: {
    type: Number,
    default: 0
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
  operatorPerformance: [{
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    totalClients: Number,
    activeClients: Number,
    totalCredits: Number,
    activeCredits: Number,
    totalCreditAmount: Number,
    totalRepaidAmount: Number
  }],
  recentActivity: [{
    type: {
      type: String,
      enum: ['newOperator', 'newClient', 'newCredit', 'repayment', 'creditCompleted', 'creditDefaulted']
    },
    date: Date,
    description: String,
    relatedId: mongoose.Schema.Types.ObjectId,
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
adminDashboardSchema.index({ date: -1 });

const AdminDashboard = mongoose.model('AdminDashboard', adminDashboardSchema);

module.exports = AdminDashboard;
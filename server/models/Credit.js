const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Le client est requis']
  },
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'opérateur est requis']
  },
  amount: {
    type: Number,
    required: [true, 'Le montant du crédit est requis'],
    min: [0, 'Le montant du crédit ne peut pas être négatif']
  },
  interestRate: {
    type: Number,
    required: [true, 'Le taux d\'intérêt est requis'],
    min: [0, 'Le taux d\'intérêt ne peut pas être négatif']
  },
  term: {
    type: Number,
    required: [true, 'La durée du prêt est requise'],
    min: [1, 'La durée du prêt doit être d\'au moins 1 mois']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin du prêt est requise']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'],
    default: 'pending'
  },
  purpose: {
    type: String,
    required: [true, 'Le but du prêt est requis']
  },
  repayments: [{
    dueDate: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'late', 'defaulted'],
      default: 'pending'
    },
    paidDate: Date,
    paidAmount: Number
  }],
  totalRepaid: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Méthode virtuelle pour calculer le montant restant à rembourser
creditSchema.virtual('remainingAmount').get(function() {
  return this.amount + (this.amount * this.interestRate / 100) - this.totalRepaid;
});

// Méthode pour calculer le montant total à rembourser (principal + intérêts)
creditSchema.virtual('totalAmount').get(function() {
  return this.amount + (this.amount * this.interestRate / 100);
});

// Méthode pour vérifier si le crédit est en retard
creditSchema.methods.isLate = function() {
  const today = new Date();
  return this.repayments.some(repayment => 
    repayment.status === 'pending' && repayment.dueDate < today
  );
};

// Index pour améliorer les performances des requêtes
creditSchema.index({ client: 1, operator: 1 });
creditSchema.index({ status: 1 });
creditSchema.index({ startDate: 1, endDate: 1 });

const Credit = mongoose.model('Credit', creditSchema);

module.exports = Credit;
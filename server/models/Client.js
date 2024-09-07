const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  dateOfBirth: {
    type: Date
  },
  occupation: {
    type: String,
    trim: true
  },
  income: {
    type: Number,
    min: 0
  },
  creditScore: {
    type: Number,
    min: 300,
    max: 850
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Méthode virtuelle pour obtenir le nom complet
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Méthode pour obtenir l'âge du client
clientSchema.methods.getAge = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Index pour améliorer les performances des requêtes
clientSchema.index({ lastName: 1, firstName: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ createdBy: 1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
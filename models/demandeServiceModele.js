//backendTache21/models/demandeServiceModele.js

const mongoose = require('mongoose');

const DemandeServiceSchema = new mongoose.Schema(
  {
    typeService: {
      type: String,
      required: true,
      trim: true,
      description: 'Type de service demandé (exemple : plomberie, électricité, etc.).',
    },
    numeroTelephone: {
      type: String,
      required: true,
      match: [/^\d+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres.'],
      description: 'Numéro de téléphone du client.',
    },
    description: {
      type: String,
      
      trim: true,
      maxlength: 500,
      description: 'Description détaillée de la demande de service.',
    },
    adresse: {
      type: String,
      required: true,
      trim: true,
      description: 'Adresse où le service est requis.',
    },
    date: {
      type: Date,
      required: true,
      description: 'Date prévue pour le service.',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'client',
      required: true,
      description: 'Référence vers l’utilisateur client ayant fait la demande.',
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'prestataire',
      required: true,
      description: 'Référence vers le prestataire assigné à la demande.',
    },
    statut: {
      type: String,
      enum: ['en attente', 'acceptée', 'refusée', 'terminée'],
      default: 'en attente',
      description: 'Statut actuel de la demande de service.',
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('DemandeService', DemandeServiceSchema);

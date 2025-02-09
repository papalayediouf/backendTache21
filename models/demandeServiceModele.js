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
      required: true,
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
    demandeur: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      description: 'Référence vers l’utilisateur ayant fait la demande.',
      refPath: 'demandeurType', // Référence dynamique
    },
    demandeurType: {
      type: String,
      required: true,
      enum: ['Client', 'Prestataire'], // Peut être un client ou un prestataire
      description: 'Type d\'utilisateur (Client ou Prestataire) qui fait la demande.',
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prestataire',
      required: true,
      description: 'Référence vers le prestataire assigné à la demande.',
    },
    statut: {
      type: String,
      enum: ['attente', 'accepte', 'refuse'],
      default: 'attente',
      description: 'Statut actuel de la demande de service.',
    },
  }
);

module.exports = mongoose.model('DemandeService', DemandeServiceSchema);

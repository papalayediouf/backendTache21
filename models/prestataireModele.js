const mongoose = require('mongoose');

const prestataireSchema = mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    nomDeLentreprise: { type: String, required: true }, 
    telephone: { type: String, required: true },
    region: { type: String, required: true },
    departement: { type: String, required: true }, 
    description: { type: String },
    role: {
      type: String,
      default: 'prestataire',
    },
    // Champ pour le code de réinitialisation
    codeReset: {
      type: String,
      default: null,
    },
    // Champ pour la date d'expiration du code
    codeResetExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prestataire', prestataireSchema);

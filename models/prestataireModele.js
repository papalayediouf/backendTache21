const mongoose = require('mongoose');

const prestataireSchema = mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    nomEntreprise: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    telephone: { type: String, required: true },
    region: { type: String, required: true },
    description: { type: String, required: true }, 
    role: {
      type: String,
      default: 'prestataire', 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prestataire', prestataireSchema);

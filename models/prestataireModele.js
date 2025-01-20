const mongoose = require('mongoose');

const prestataireSchema = mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    description: { type: String, required: true }, 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prestataire', prestataireSchema);

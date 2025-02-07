//backendTache21/models/commentaireModele.js
const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Référence au modèle Client, modifie selon ton besoin
    required: true
  },
  contenu: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire', // Référence au prestataire concerné, modifie selon ton besoin
    required: true
  }
});

module.exports = mongoose.model('Commentaire', commentaireSchema);

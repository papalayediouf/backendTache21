const mongoose = require('mongoose');

// Définir le schéma du commentaire
const commentaireSchema = new mongoose.Schema({
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service',  // Lien avec le modèle Service
    required: true 
  },
  commentaire: { 
    type: String, 
    minlength: 1,
    maxlength: 500  // Limite la taille du commentaire à 500 caractères
  },
  note: { 
    type: Number, 
    min: 1,   // La note minimale
    max: 5,   // La note maximale
    ///
  },
  date: { 
    type: Date, 
    default: Date.now  // La date d'ajout du commentaire
  }
});

// Créer le modèle basé sur le schéma
const Commentaire = mongoose.model('Commentaire', commentaireSchema);

// Exporter le modèle
module.exports = Commentaire;

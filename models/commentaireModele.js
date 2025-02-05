const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // Le service commenté
    auteur: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'auteurModel' // Référence dynamique au modèle (Client, Prestataire ou Admin)
    },
    auteurModel: {
        type: String,
        required: true,
        enum: ['Client', 'Prestataire', 'Admin'] // Permet de savoir le type d'auteur
    },
    texte: { type: String, required: true }, // Contenu du commentaire
    note: { type: Number, required: true, min: 1, max: 5 }, // Note sur 5 étoiles
    date: { type: Date, default: Date.now } // Date du commentaire
});

module.exports = mongoose.model('Commentaire', commentaireSchema);

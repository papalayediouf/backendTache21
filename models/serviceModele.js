const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    nomDeservice: { type: String, required: true },
    categorie: { type: String, required: true },
    descriptionDeService: { type: String, required: true }, // Corrigé à String
    imageService: { type: String, required: true },
    imageDiplomes: { type: String, default: '' }, // Valeur par défaut pour éviter un champ vide
    prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestataire', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

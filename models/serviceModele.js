const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    nomDeservice: { type: String, required: true },
    categorie: { type: String, required: true },
    descriptionDeService: { type: Number, required: true },
    imageService: { type: String, required: true },
    imageDiplomes: { type: String, },
    // prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
}, { timestamps: true }); 

module.exports = mongoose.model('Service', serviceSchema);

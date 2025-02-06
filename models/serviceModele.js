// backendTache21/models/serviceModele.js
const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    nomDeservice: { type: String, required: true },
    categorie: { type: String, required: true },
    descriptionDeService: { type: String, required: true },
    imageService: { type: String, default: ''  },
    prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestataire', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
//
const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    image: { type: String, required: true },
    prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
}, { timestamps: true }); // Ajout de timestamps pour createdAt et updatedAt

module.exports = mongoose.model('Service', serviceSchema);

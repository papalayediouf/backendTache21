// backendTache21/models/categorieModele.js

const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    archive: { type: Boolean, default: false } // Nouveau champ pour l'archivage
});

module.exports = mongoose.model('Categorie', categorieSchema);

///backend/models/utilisateurModele.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role: { type: String, enum: ['client', 'prestataire', 'admin'], default: 'client' }
});

utilisateurSchema.pre('save', async function (next) {
    if (!this.isModified('motDePasse')) {
        next(); 
    }
    this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);

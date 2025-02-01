const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true, 
        trim: true,
    },
    prenom: {
        type: String,
        required: true, 
        trim: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true, 
    },
    motDePasse: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'client',
    },
    // Champ pour le code de réinitialisation
    codeReset: {
        type: String,
        default: null,
    },
    // Champ pour la date d'expiration du code
    codeResetExpire: {
        type: Date,
        default: null,
    },

}, {
    timestamps: true, 
});

// Création du modèle à partir du schéma
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

//backendTache21/models/clientModele.js

const mongoose = require('mongoose');

// Définition du schéma pour le modèle Client
const clientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true, // Le champ est requis
        trim: true,
    },
    prenom: {
        type: String,
        required: true, // Le champ est requis
        trim: true,
    },
    email: {
        type: String,
        required: true, // Le champ est requis
        unique: true, // Chaque email doit être unique dans la base de données
        trim: true,
        lowercase: true, // Convertit l'email en minuscule
    },
    motDePasse: {
        type: String,
        required: true, // Le mot de passe est requis
    },
    role: {
        type: String,
        default: 'client', // Le rôle par défaut est 'client'
    },

}, {
    timestamps: true, // Ajoute des champs 'createdAt' et 'updatedAt'
});

// Création du modèle à partir du schéma
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

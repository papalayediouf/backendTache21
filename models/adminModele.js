// backendTache21/models/adminModele.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma pour l'admin
const adminSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, 'Le nom est requis'],
        },
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            unique: true,
        },
        motDePasse: {
            type: String,
            required: [true, 'Le mot de passe est requis'],
        },
        role: {
            type: String,
            default: 'admin',
        },
    },
    {
        timestamps: true, 
    }
);


// Exportation du modèle
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

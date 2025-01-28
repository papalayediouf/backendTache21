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

// Middleware pour hasher le mot de passe avant l'enregistrement
adminSchema.pre('save', async function (next) {
    if (!this.isModified('motDePasse')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    console.log('Mot de passe hashé avant enregistrement:', this.motDePasse);  
    next();
});

// Méthode pour vérifier le mot de passe
adminSchema.methods.verifierMotDePasse = async function (motDePasse) {
    return await bcrypt.compare(motDePasse, this.motDePasse);
};

// Exportation du modèle
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

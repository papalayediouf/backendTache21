const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModele');

const connectDB = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connexion à MongoDB réussie');

        // Création de l'admin par défaut//
        await creerAdminParDefaut();
    } catch (err) {
        console.error('Erreur de connexion à MongoDB :', err);
        process.exit(1); 
    }
};

// Fonction pour ajouter un admin par défaut
const creerAdminParDefaut = async () => {
    try {
        const adminExistant = await Admin.findOne({ email: 'papalayediouf17@gmail.com' });
        console.log('Admin existant:', adminExistant);  // Ajoute un log pour vérifier si l'admin existe déjà

        if (!adminExistant) {
            const motDePasse = '1234';
            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            const nouvelAdmin = new Admin({
                nom: 'Administrateur',
                email: 'papalayediouf17@gmail.com',
                motDePasse: motDePasseHash,
            });

            const adminEnregistre = await nouvelAdmin.save();
            console.log('Admin par défaut créé avec succès:', adminEnregistre);
        } else {
            console.log('Un admin existe déjà dans la base de données.');
        }
    } catch (err) {
        console.error('Erreur lors de la création de l\'admin par défaut :', err);
    }
};



module.exports = connectDB;

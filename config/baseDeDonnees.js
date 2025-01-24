//backend/config/baseDeDonnees.js
const mongoose = require('mongoose');
const Utilisateur = require('../models/utilisateurModele');
const bcrypt = require('bcryptjs');


//
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connexion à MongoDB réussie');

        const adminExist = await Utilisateur.findOne({ role: 'admin' });
        if (!adminExist) {
            const admin = new Utilisateur({
                email: 'papalayediouf17@gmail.com',
                motDePasse: 'admin1234',
                nom: 'Admin',
                role: 'admin',
            });

            // Hashage du mot de passe admin
            admin.motDePasse = await bcrypt.hash(admin.motDePasse, 10);

            await admin.save();
            console.log('Admin créé avec succès.');
        }
    } catch (err) {
        console.error('Erreur de connexion à MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;

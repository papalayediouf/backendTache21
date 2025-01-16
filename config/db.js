const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connexion à MongoDB réussie');

        // Vérifier si l'admin existe déjà
        const adminExist = await User.findOne({ role: 'admin' });
        if (!adminExist) {
            
            const admin = new User({
                email: 'admin@domaine.com',
                mot_de_passe: 'admin1234', 
                nom: 'Admin',
                role: 'admin'
            });
            
            // Hashage du mot de passe admin
            const salt = await bcrypt.genSalt(10);
            admin.mot_de_passe = await bcrypt.hash(admin.mot_de_passe, salt);

            await admin.save();
            console.log('Admin créé avec succès.');
        }
    } catch (err) {
        console.error('Erreur de connexion à MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;

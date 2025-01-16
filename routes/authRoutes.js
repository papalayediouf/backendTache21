const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// Route pour l'inscription
router.post('/signup', async (req, res) => {
    const { email, mot_de_passe, nom, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const utilisateurExist = await User.findOne({ email });
        if (utilisateurExist) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Créer un nouvel utilisateur
        const utilisateur = new User({
            email,
            mot_de_passe,
            nom,
            role
        });

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        utilisateur.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);

        // Sauvegarder l'utilisateur dans la base de données
        await utilisateur.save();
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // Si l'email est celui de l'admin
        if (email === 'admin@domaine.com') {
            const admin = await User.findOne({ email });

            if (!admin) {
                return res.status(400).json({ message: "Admin non trouvé" });
            }

            // Vérifier le mot de passe
            const match = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
            if (!match) {
                return res.status(400).json({ message: "Mot de passe incorrect pour l'admin" });
            }

            // Générer le token JWT
            const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: "Connexion admin réussie", token, admin });
        }

        // Connexion pour les autres utilisateurs (prestataire ou client)
        const utilisateur = await User.findOne({ email });
        if (!utilisateur) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        const match = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!match) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign({ id: utilisateur._id, role: utilisateur.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Connexion réussie", token, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});


module.exports = router;

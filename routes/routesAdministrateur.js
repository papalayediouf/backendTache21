const express = require('express');
const router = express.Router();
const { verifierToken } = require('../middlewares/authentification'); // Middleware pour vérifier le token
const verifierRole = require('../middlewares/verifierRole'); // Middleware pour vérifier les rôles
const Utilisateur = require('../models/utilisateurModele'); // Modèle des utilisateurs

// Route accessible uniquement à l'administrateur
router.get('/admin/dashboard', verifierToken, verifierRole(['admin']), (req, res) => {
    res.json({ message: "Bienvenue sur le dashboard admin." });
});

// Route accessible uniquement aux prestataires
router.get('/prestataire/ajouter-service', verifierToken, verifierRole(['prestataire']), (req, res) => {
    res.json({ message: "Page pour ajouter un service." });
});

// Route accessible à tous les utilisateurs connectés (client, prestataire, admin)
router.get('/profil', verifierToken, (req, res) => {
    res.json({ message: `Bienvenue, ${req.utilisateur.nom}.` });
});

// Route pour devenir prestataire
router.post('/devenir-prestataire', verifierToken, async (req, res) => {
    try {
        const utilisateurId = req.utilisateur.id; // ID récupéré depuis le token JWT
        const utilisateur = await Utilisateur.findById(utilisateurId);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        // Vérifie si l'utilisateur est déjà prestataire
        if (utilisateur.role === 'prestataire') {
            return res.status(400).json({ message: "Vous êtes déjà un prestataire." });
        }

        // Met à jour le rôle de l'utilisateur
        utilisateur.role = 'prestataire';
        await utilisateur.save();

        res.json({
            message: "Vous êtes maintenant prestataire. Vous pouvez ajouter vos services.",
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rôle :", error.message);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

module.exports = router;

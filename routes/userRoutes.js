const express = require('express');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware'); // Pour vérifier si l'utilisateur est authentifié

const router = express.Router();

// Route pour devenir prestataire
router.post('/devenir-prestataire', authMiddleware, async (req, res) => {
    const { localisation, paiementEffectue } = req.body;

    try {
        // Récupérer l'utilisateur connecté
        const utilisateur = await User.findById(req.user.id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier que l'utilisateur est encore un client
        if (utilisateur.role === 'prestataire') {
            return res.status(400).json({ message: "Vous êtes déjà un prestataire" });
        }

        // Vérifier les conditions pour devenir prestataire
        if (!localisation || !paiementEffectue) {
            return res.status(400).json({
                message: "Veuillez remplir toutes les conditions pour devenir prestataire : localisation et paiement"
            });
        }

        // Mettre à jour le rôle et les informations de l'utilisateur
        utilisateur.role = 'prestataire';
        utilisateur.localisation = localisation;
        utilisateur.paiementEffectue = paiementEffectue;

        // Sauvegarder les modifications
        await utilisateur.save();

        res.status(200).json({
            message: "Vous êtes maintenant un prestataire",
            utilisateur
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Route pour ajouter un service (prestataire uniquement)
router.post('/ajouter-service', authMiddleware, async (req, res) => {
    const { titre, description, prix } = req.body;

    try {
        const utilisateur = await User.findById(req.user.id);

        if (!utilisateur || utilisateur.role !== 'prestataire') {
            return res.status(403).json({ message: "Accès refusé : vous n'êtes pas un prestataire" });
        }

        // Ajouter un nouveau service
        const nouveauService = { titre, description, prix };
        utilisateur.services.push(nouveauService);

        // Sauvegarder les modifications
        await utilisateur.save();

        res.status(201).json({
            message: "Service ajouté avec succès",
            services: utilisateur.services
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});


module.exports = router;

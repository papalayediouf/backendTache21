const express = require('express');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route pour récupérer tous les utilisateurs (admin uniquement)
router.get('/utilisateurs', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const utilisateurs = await User.find();
        res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Route pour supprimer un utilisateur (admin uniquement)
router.delete('/utilisateur/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const utilisateur = await User.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await utilisateur.remove();
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Route pour gérer les services des prestataires (admin uniquement)
router.get('/services', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const prestataires = await User.find({ role: 'prestataire' });
        const services = prestataires.flatMap(prestataire => prestataire.services);

        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;

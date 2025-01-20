const express = require('express');
const {
    inscription,
    connexion,
    devenirPrestataire
} = require('../controllers/controleurUtilisateurs');
const { verifierToken } = require('../middlewares/authentification'); // Middleware pour vérifier le token

const router = express.Router();

// Route pour l'inscription d'un utilisateur
router.post('/inscription', inscription);

// Route pour la connexion d'un utilisateur
router.post('/connexion', connexion);

// Route pour devenir prestataire (protégée par le middleware d'authentification)
router.post('/devenir-prestataire', verifierToken, devenirPrestataire);

module.exports = router;

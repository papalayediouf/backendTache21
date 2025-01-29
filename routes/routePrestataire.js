const express = require('express');
const { inscriptionPrestataire, profilPrestataire } = require('../controllers/controleurdevenirPrestataire');
const { verifierToken } = require('../middlewares/authentification'); 

const router = express.Router();

// Route pour l'inscription d'un prestataire
router.post('/inscription-prestataire', inscriptionPrestataire);

// Route pour récupérer le profil d'un prestataire (protégée par l'authentification)
router.get('/profil-prestataire', verifierToken, profilPrestataire);

module.exports = router;

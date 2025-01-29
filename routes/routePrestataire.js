const express = require('express');
const { inscriptionPrestataire, profilPrestataire } = require('../controllers/controleurdevenirPrestataire');
// const { verifierToken } = require('../middlewares/authentification'); // Assurez-vous que ce middleware est présent pour protéger la route

const router = express.Router();

// Route pour l'inscription d'un prestataire
router.post('/inscription-prestataire', inscriptionPrestataire);

// Route pour récupérer le profil d'un prestataire (protégée par l'authentification)
router.get('/profil-prestataire',  profilPrestataire);

module.exports = router;

const express = require('express');
const { 
  inscriptionPrestataire, 
  profilPrestataire, 
  listerPrestataires // Importation de la nouvelle fonction
} = require('../controllers/controleurdevenirPrestataire');
const { verifierToken } = require('../middlewares/authentification'); 

const router = express.Router();

// Route pour l'inscription d'un prestataire
router.post('/inscription-prestataire', inscriptionPrestataire);

// Route pour récupérer le profil d'un prestataire (protégée par l'authentification)
router.get('/profil-prestataire', verifierToken, profilPrestataire);

// Route pour lister tous les prestataires (accessible sans authentification)
router.get('/liste-prestataires', listerPrestataires);

module.exports = router;

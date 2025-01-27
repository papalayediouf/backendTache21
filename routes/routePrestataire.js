const express = require('express');
const {
  inscriptionPrestataire,
  
} = require('../controllers/controleurdevenirPrestataire');
const { verifierToken } = require('../middlewares/authentification'); // Utilisation du middleware de vérification du token
const verifierRole = require('../middlewares/verifierRole'); // Utilisation du middleware de vérification du rôle

const router = express.Router();

// Route pour l'inscription d'un prestataire
router.post('/inscription-prestataire', inscriptionPrestataire);



module.exports = router;

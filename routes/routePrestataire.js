const express = require('express');
const { 
  inscriptionPrestataire, 
  profilPrestataire, 
  listerPrestataires, 
  supprimerDemandeReservation // Importation de la fonction de suppression
} = require('../controllers/controleurdevenirPrestataire');
const { verifierToken } = require('../middlewares/authentification'); 

const router = express.Router();

// Route pour l'inscription d'un prestataire
router.post('/inscription-prestataire', inscriptionPrestataire);

// Route pour récupérer le profil d'un prestataire (protégée par l'authentification)
router.get('/profil-prestataire', verifierToken, profilPrestataire);

// Route pour lister tous les prestataires (accessible sans authentification)
router.get('/liste-prestataires', listerPrestataires);

// Route pour supprimer une demande de réservation (protégée par l'authentification)
router.delete('/demandes/:demandeId', verifierToken, supprimerDemandeReservation);

module.exports = router;

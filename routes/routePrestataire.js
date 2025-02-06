//backendTache21/routes/routePrestataire.js

const express = require('express');
const { 
  inscriptionPrestataire, 
  profilPrestataire, 
  modifierProfilPrestataire,
  listerPrestataires, 
  supprimerDemandeReservation // Importation de la fonction de suppression
} = require('../controllers/controleurdevenirPrestataire');
const { verifierToken } = require('../middlewares/authentification'); 
const verifieRole = require('../middlewares/verifierRole');


const router = express.Router();

router.post('/inscription-prestataire', inscriptionPrestataire);

// Route pour récupérer le profil d'un prestataire (protégée par l'authentification)
router.get('/profil-prestataire', verifierToken, profilPrestataire);

router.put('/mettre-a-jour-prestataire',verifierToken, verifieRole(['prestataire']),  modifierProfilPrestataire);

// Route pour lister tous les prestataires (accessible sans authentification)
router.get('/liste-prestataires', listerPrestataires);

// Route pour supprimer une demande de réservation (protégée par l'authentification)
router.delete('/demandes/:demandeId', verifierToken, supprimerDemandeReservation);

module.exports = router;

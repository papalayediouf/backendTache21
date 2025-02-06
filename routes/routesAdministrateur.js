const express = require('express');
const {
  profilAdministrateur,
  modifierProfilAdministrateur,
  bloquerComptePrestataire,
  debloquerComptePrestataire,
} = require('../controllers/controleurAdministrateur');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const routeur = express.Router();
//
// Récupérer le profil de l'administrateur
routeur.get('/profil', verifierToken, verifierRole(['admin']), profilAdministrateur);

// Modifier le profil de l'administrateur
routeur.put('/modifier-profil', verifierToken, verifierRole(['admin']), modifierProfilAdministrateur);

// Bloquer un prestataire
routeur.put('/prestataire/bloquer/:idPrestataire', verifierToken, verifierRole(['admin']), bloquerComptePrestataire);

// Débloquer un prestataire
routeur.put('/prestataire/debloquer/:idPrestataire', verifierToken, verifierRole(['admin']), debloquerComptePrestataire);

module.exports = routeur;

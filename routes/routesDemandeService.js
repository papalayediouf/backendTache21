// backendTache21/routes/routesDemandeService.js
const express = require('express');
const { verifierToken } = require('../middlewares/authentification');
const   verifierRole  = require('../middlewares/verifierRole');
const {
  creerDemandeService,
  obtenirDemandesParClient,
  obtenirDemandesParPrestataire,
  mettreAJourStatutDemande,
} = require('../controllers/controleurDemandeService');

const routeur = express.Router();


routeur.post(
  '/demande',
  verifierToken,
  verifierRole(['client','prestataire']),
  creerDemandeService
);


routeur.get(
  '/client',
  verifierToken,
  verifierRole(['client']),
  obtenirDemandesParClient
);


routeur.get(
  '/prestataire',
  verifierToken,
  verifierRole(['prestataire']),
  obtenirDemandesParPrestataire
);


routeur.put(
  '/:id/statut',
  verifierToken,
  verifierRole(['prestataire']),
  mettreAJourStatutDemande
);

module.exports = routeur;

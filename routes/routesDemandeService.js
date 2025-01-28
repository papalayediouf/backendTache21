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

/**
 * @route POST /api/demandes
 * @description Créer une nouvelle demande de service (uniquement pour les clients)
 * @access Privé (Client uniquement)
 */
routeur.post(
  '/demande',
  verifierToken,
  verifierRole(['client','prestataire']),
  creerDemandeService
);

/**
 * @route GET /api/demandes/client
 * @description Obtenir toutes les demandes créées par le client connecté
 * @access Privé (Client uniquement)
 */
routeur.get(
  '/client',
  verifierToken,
  verifierRole(['client']),
  obtenirDemandesParClient
);

/**
 * @route GET /api/demandes/prestataire
 * @description Obtenir toutes les demandes assignées au prestataire connecté
 * @access Privé (Prestataire uniquement)
 */
routeur.get(
  '/prestataire',
  verifierToken,
  verifierRole(['prestataire']),
  obtenirDemandesParPrestataire
);

/**
 * @route PUT /api/demandes/:id/statut
 * @description Mettre à jour le statut d'une demande de service
 * @access Privé (Prestataire uniquement)
 */
routeur.put(
  '/:id/statut',
  verifierToken,
  verifierRole(['prestataire']),
  mettreAJourStatutDemande
);

module.exports = routeur;

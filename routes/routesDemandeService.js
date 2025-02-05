const express = require('express');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const {
  creerDemandeService,
  obtenirToutesLesDemandes,
  obtenirDemandesParClient,
  obtenirDemandesParPrestataire,
  mettreAJourStatutDemande,
} = require('../controllers/controleurDemandeService');

const routeur = express.Router();

/// **Créer une demande (client ou prestataire)**
routeur.post(
  '/demande',
  verifierToken,
  verifierRole(['client', 'prestataire']),
  creerDemandeService
);

/// **Obtenir toutes les demandes (uniquement admin)**
routeur.get(
  '/toutes',
  verifierToken,
  verifierRole(['admin']),
  obtenirToutesLesDemandes
);

/// **Obtenir les demandes d'un client**
routeur.get(
  '/client',
  verifierToken,
  verifierRole(['client']),
  obtenirDemandesParClient
);

/// **Obtenir les demandes d'un prestataire**
routeur.get(
  '/prestataire',
  verifierToken,
  verifierRole(['prestataire']),
  obtenirDemandesParPrestataire
);

/// **Mettre à jour le statut d'une demande (prestataire uniquement)**
routeur.put(
  '/:id/statut',
  verifierToken,
  verifierRole(['prestataire']),
  mettreAJourStatutDemande
);

module.exports = routeur;

//backendTache21/routes/routesMotDePasse.js

const express = require('express');
const {
  demanderReinitialisationMotDePasse,
  reinitialiserMotDePasse,
} = require('../controllers/controleurMotDePasse');

const routeur = express.Router();

// Route pour demander la reinitialisation du mot de passe
routeur.post('/oublie', demanderReinitialisationMotDePasse);

// Route pour reinitialiser le mot de passe
routeur.post('/modifier', reinitialiserMotDePasse);

module.exports = routeur;

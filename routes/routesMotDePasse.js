const express = require('express');
const {
  demanderReinitialisationMotDePasse,
  reinitialiserMotDePasse,
} = require('../controllers/controleurMotDePasse');

const routeur = express.Router();

// Route pour demander la réinitialisation du mot de passe
routeur.post('/oublie', demanderReinitialisationMotDePasse);

// Route pour réinitialiser le mot de passe
routeur.post('/modifier', reinitialiserMotDePasse);

module.exports = routeur;

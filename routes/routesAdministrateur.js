const express = require('express');
const { bloquerComptePrestataire, debloquerComptePrestataire } = require('../controllers/controleurAdministrateur');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const routeur = express.Router();

routeur.put('/prestataire/bloquer/:idPrestataire', verifierToken, verifierRole(['client']), bloquerComptePrestataire);
routeur.put('/prestataire/debloquer/:idPrestataire', verifierToken, verifierRole(['client']), debloquerComptePrestataire);

module.exports = routeur;

const express = require('express');
const { bloquerComptePrestataire, debloquerComptePrestataire } = require('../controllers/controleurAdministrateur');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const routeur = express.Router();

routeur.put('/prestataire/bloquer/:idPrestataire', verifierToken, verifierRole(['admin']), bloquerComptePrestataire);
routeur.put('/prestataire/debloquer/:idPrestataire', verifierToken, verifierRole(['admin']), debloquerComptePrestataire);

module.exports = routeur;

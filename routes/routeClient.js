//backendTache21/routes/routeClient.js
const express = require('express');
const {
  inscriptionClient,
  mettreAJourClient,
  listeClients,
  obtenirClient,
} = require('../controllers/controleurClient');
const {verifierToken} = require('../middlewares/authentification');
const verifieRole = require('../middlewares/verifierRole');

const router = express.Router();

// Route pour inscrire un nouveau client
router.post('/inscription-client', inscriptionClient);

// Route pour connecter un client

router.get('/profil-client', verifierToken, verifieRole(['client']), obtenirClient);

router.put('/mettre-a-jour-client',verifierToken, verifieRole(['client']), mettreAJourClient);

router.get('/liste-clients', verifierToken, verifieRole(['admin']), listeClients);


module.exports = router;

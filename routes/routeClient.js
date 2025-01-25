const express = require('express');
const {
  inscriptionClient,
  connexionClient,
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
router.post('/connexion-client', connexionClient);

// Route pour récupérer le profil du client connecté
router.get('/profil-client', verifierToken, verifieRole(['client']), obtenirClient);

// Route pour mettre à jour les informations du client connecté
router.put('/mettre-a-jour-client',verifierToken, verifieRole(['client']), mettreAJourClient);

// Route pour récupérer la liste de tous les clients (par exemple, pour l'admin)
router.get('/liste-clients', verifierToken, verifieRole(['admin']), listeClients);

module.exports = router;

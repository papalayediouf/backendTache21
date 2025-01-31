const express = require('express');
const {  listerUtilisateurs  } = require('../controllers/controleurStatistique'); 
const { verifierToken } = require('../middlewares/authentification');
const verifieRole = require('../middlewares/verifierRole');

const router = express.Router();

// Route pour lister tous les utilisateurs
router.get('/liste-utilisateurs', verifierToken, verifieRole(['admin']),  listerUtilisateurs );

module.exports = router;
//
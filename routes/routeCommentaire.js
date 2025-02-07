const express = require('express');
const router = express.Router();
const { ajouterCommentaire } = require('../controllers/controleurCommentaire');
const { verifierToken } = require('../middlewares/authentification'); 

// Ajouter un commentaire (client authentifié)
router.post('/ajouter', verifierToken, ajouterCommentaire );

module.exports = router;

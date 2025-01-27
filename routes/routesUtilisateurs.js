const express = require('express');
const { connexion } = require('../controllers/controleurUtilisateurs');
const router = express.Router();

// Route pour la connexion des utilisateurs (prestataires et clients)
router.post('/connexion', connexion);

module.exports = router;

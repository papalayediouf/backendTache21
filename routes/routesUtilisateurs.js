const express = require('express');
const {
    inscription,
    connexion,
    devenirPrestataire
} = require('../controllers/controleurUtilisateurs');
const { verifierToken } = require('../middlewares/authentification'); 

const router = express.Router();

router.post('/inscription', inscription);

// Route pour la connexion d'un utilisateur
router.post('/connexion', connexion);

router.post('/devenir-prestataire', verifierToken, devenirPrestataire);

module.exports = router;

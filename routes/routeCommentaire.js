const express = require('express');
const router = express.Router();
const { ajouterCommentaire, obtenirCommentaires, supprimerCommentaire } = require('../controllers/controleurCommentaire');
const { verifierToken } = require('../middlewares/authentification'); 

// Ajouter un commentaire (client authentifié)
router.post('/ajouter', verifierToken, ajouterCommentaire);

// Obtenir les commentaires d'un service
router.get('/:serviceId', obtenirCommentaires);

// Supprimer un commentaire (auteur ou admin)
router.delete('/supprimer/:id', verifierToken , supprimerCommentaire);

module.exports = router;

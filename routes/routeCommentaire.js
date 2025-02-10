const express = require('express');
const router = express.Router();
const controleurCommentaire = require('../controllers/controleurCommentaire'); // Importer le contrôleur des commentaires

// Ajouter un commentaire à un service
router.post('/services/:serviceId/commentaires', controleurCommentaire.ajouterCommentaire);

// Récupérer les commentaires d'un service spécifique
router.get('/services/:serviceId/commentaires-recu', controleurCommentaire.getCommentaires);

// Modifier un commentaire
router.put('/modifier/:id', controleurCommentaire.modifierCommentaire);

// Supprimer un commentaire
router.delete('/supprimer/:id', controleurCommentaire.supprimerCommentaire);

// Route pour récupérer les statistiques des notes pour un service
router.get('/services/:serviceId/statistique-notes', controleurCommentaire.statistiqueNotes);


module.exports = router;  // Exporter le module pour pouvoir l'utiliser dans l'application principale

//backendTache21/routes/routesCategorie.js
const express = require('express');
const router = express.Router();
const { ajouterCategorie, afficherCategories } = require('../controllers/controleurCategorie');

// Route pour ajouter une catégorie
router.post('/ajouter', ajouterCategorie);

// Route pour afficher toutes les catégories
router.get('/liste', afficherCategories);

module.exports = router;

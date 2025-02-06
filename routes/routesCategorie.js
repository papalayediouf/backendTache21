const express = require('express');
const router = express.Router();
const { ajouterCategorie, afficherCategories, archiverCategorie } = require('../controllers/controleurCategorie');

// Route pour ajouter une catégorie
router.post('/ajouter', ajouterCategorie);

// Route pour afficher toutes les catégories (non archivées)
router.get('/liste', afficherCategories);

// Route pour archiver/désarchiver une catégorie
router.put('/archiver/:id', archiverCategorie);

module.exports = router;

const express = require('express');
const {
  inscriptionPrestataire,
  connexionPrestataire,
  devenirPrestataire,
  obtenirProfilPrestataire,
  listePrestataires,
  mettreAJourPrestataire,
} = require('../controllers/controleurdevenirPrestataire');
const { verifierToken } = require('../middlewares/authentification'); // Utilisation du middleware de vérification du token
const verifierRole = require('../middlewares/verifierRole'); // Utilisation du middleware de vérification du rôle

const router = express.Router();

// Route pour l'inscription d'un prestataire
router.post('/inscription-prestataire', inscriptionPrestataire);

// Route pour la connexion d'un prestataire
router.post('/connexion-prestataire', connexionPrestataire);

// Route pour devenir prestataire (pour un utilisateur déjà inscrit)
router.post('/devenir-prestataire', verifierToken, devenirPrestataire);

// Route pour récupérer les informations du profil d'un prestataire connecté
router.get('/profil-prestataire', verifierToken, verifierRole(['prestataire']), obtenirProfilPrestataire);

// Route pour obtenir la liste de tous les prestataires (accessible aux clients ou admins)
router.get('/liste-prestataires', verifierToken, listePrestataires);

// Route pour mettre à jour les informations du prestataire connecté
router.put('/mettre-a-jour-prestataire', verifierToken, verifierRole(['prestataire']), mettreAJourPrestataire);

module.exports = router;

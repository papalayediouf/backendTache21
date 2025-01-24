const express = require('express');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const Utilisateur = require('../models/utilisateurModele');
const Service = require('../models/serviceModele'); 

const routeur = express.Router();

// Route accessible uniquement aux utilisateurs authentifiés
routeur.get('/profil', verifierToken, async (requete, reponse) => {
  try {
    const utilisateur = await Utilisateur.findById(requete.utilisateur._id).select('-motDePasse');
    if (!utilisateur) {
      return reponse.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    reponse.json({ utilisateur });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
});

// Route accessible uniquement aux administrateurs
routeur.get('/admin/dashboard', verifierToken, verifierRole(['admin']), (requete, reponse) => {
  reponse.json({ message: 'Bienvenue sur le tableau de bord administrateur.' });
});

// Route accessible uniquement aux prestataires
routeur.get('/prestataire/services', verifierToken, verifierRole(['prestataire']), async (requete, reponse) => {
  try {
    const services = await Service.find({ prestataire: requete.utilisateur._id });
    reponse.json({ services });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la récupération des services.' });
  }
});

// Route accessible aux administrateurs et aux prestataires
routeur.get('/admin-prestataire/data', verifierToken, verifierRole(['admin', 'prestataire']), (requete, reponse) => {
  reponse.json({ message: 'Données accessibles aux administrateurs et prestataires.' });
});

module.exports = routeur;

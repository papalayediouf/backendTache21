const express = require('express');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const Service = require('../models/serviceModele');
const Admin = require('../models/adminModele');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');

const routeur = express.Router();

routeur.get('/profil', verifierToken, async (requete, reponse) => {
  try {
    let utilisateur;

    // Vérification du rôle et récupération de l'utilisateur selon le modèle
    if (requete.utilisateur.role === 'admin') {
      utilisateur = await Admin.findById(requete.utilisateur._id).select('-motDePasse');
    } else if (requete.utilisateur.role === 'prestataire') {
      utilisateur = await Prestataire.findById(requete.utilisateur._id).select('-motDePasse');
    } else if (requete.utilisateur.role === 'client') {
      utilisateur = await Client.findById(requete.utilisateur._id).select('-motDePasse');
    }

    if (!utilisateur) {
      return reponse.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    reponse.json({ utilisateur });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
});

routeur.get('/admin/dashboard', verifierToken, verifierRole(['admin']), async (requete, reponse) => {
  try {
    const admin = await Admin.findById(requete.utilisateur._id);
    if (!admin) {
      return reponse.status(404).json({ message: 'Admin non trouvé.' });
    }
    reponse.json({ message: 'Bienvenue sur le tableau de bord administrateur.', admin });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord.' });
  }
});

routeur.get('/prestataire/services', verifierToken, verifierRole(['prestataire']), async (requete, reponse) => {
  try {
    const prestataire = await Prestataire.findById(requete.utilisateur._id);
    if (!prestataire) {
      return reponse.status(404).json({ message: 'Prestataire non trouvé.' });
    }

    const services = await Service.find({ prestataire: prestataire._id });
    if (services.length === 0) {
      return reponse.status(404).json({ message: 'Aucun service trouvé.' });
    }

    reponse.json({ prestataire });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la récupération des services.' });
  }
});
//client
routeur.get('/client/dashboard', verifierToken, verifierRole(['client']), async (requete, reponse) => {
  try {
    const client = await Client.findById(requete.utilisateur._id);
    if (!client) {
      return reponse.status(404).json({ message: 'Client non trouvé.' });
    }

    reponse.json({ message: 'Bienvenue sur le tableau de bord client.', client });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord client.' });
  }
});

routeur.get('/admin-prestataire/data', verifierToken, verifierRole(['admin', 'prestataire']), (requete, reponse) => {
  reponse.json({ message: 'Données accessibles aux administrateurs et prestataires.' });
});

module.exports = routeur;

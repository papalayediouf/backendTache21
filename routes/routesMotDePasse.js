//backendTache21/routes/routesMotDePasse.js

const express = require('express');
const {
  demanderReinitialisationMotDePasse,
  reinitialiserMotDePasse,
} = require('../controllers/controleurMotDePasse');

const routeur = express.Router();

// Route pour demander la reinitialisation du mot de passe
routeur.post('/oublie', demanderReinitialisationMotDePasse);

routeur.post('/modifier', async (requete, reponse) => {
  const { email, codeReset, nouveauMotDePasse } = requete.body;

  try {
    const utilisateur = await Utilisateur.findOne({
      email,
      codeReset,
      codeResetExpire: { $gt: Date.now() },
    });

    if (!utilisateur) {
      return reponse.status(400).json({ message: 'Code invalide ou expiré.' });
    }

    utilisateur.motDePasse = nouveauMotDePasse;
    utilisateur.codeReset = undefined;
    utilisateur.codeResetExpire = undefined;
    await utilisateur.save();

    reponse.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la réinitialisation.' });
  }
});


module.exports = routeur;

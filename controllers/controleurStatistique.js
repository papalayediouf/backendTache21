//backendTache21/controllers/controleurStatistique.js
// Lister tout les utilisateur les clients et les prestataire

const Client = require('../models/clientModele');
const Prestataire = require('../models/prestataireModele');

const listerUtilisateurs = async (req, res) => {
  try {
    // Récupérer tous les clients
    const clients = await Client.find().select('-motDePasse'); // Exclure le mot de passe

    // Récupérer tous les prestataires
    const prestataires = await Prestataire.find().select('-motDePasse'); // Exclure le mot de passe

    res.status(200).json({
      totalClients: clients.length,
      totalPrestataires: prestataires.length,
      clients,
      prestataires
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { listerUtilisateurs };

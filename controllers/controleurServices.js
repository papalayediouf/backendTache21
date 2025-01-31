//backendTache21/controllers/controleurServices.js

const Service = require("../models/serviceModele");
const mongoose = require("mongoose");

//backendTache21/controllers/controleurServices.js
const ajouterService = async (req, res) => {
  try {
    const { nomDeservice, categorie, descriptionDeService } = req.body;

    // Récupérer le chemin des fichiers téléchargés
    const imageService = req.file ? req.file.filename : "";
    const imageDiplomes = req.file ? req.file.filename : "";

    // Vérification des champs obligatoires
    if (!nomDeservice || !categorie || !descriptionDeService) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Création du service
    const nouveauService = new Service({
      nomDeservice,
      categorie,
      descriptionDeService,
      imageService,
      imageDiplomes,
      prestataire: req.utilisateur.id,
    });

    // Sauvegarde dans la base de données
    const serviceCree = await nouveauService.save();
    res.status(201).json(serviceCree);
  } catch (err) {
    console.error("Erreur lors de l'ajout du service :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};


//backendTache21/controllers/controleurServices.js
const obtenirDetailService = async (req, res) => {
  try {
    const { id } = req.params;  // Récupérer l'ID du service depuis les paramètres de l'URL

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    // Chercher le service dans la base de données en utilisant l'ID
    const service = await Service.findById(id);

    // Vérifier si le service existe
    if (!service) {
      return res.status(404).json({ message: "Service non trouvé." });
    }

    // Retourner le service trouvé
    res.status(200).json(service);
  } catch (err) {
    console.error("Erreur lors de la récupération du service :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { ajouterService, obtenirDetailService };

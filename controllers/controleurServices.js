//backendTache21/controllers/controleurServices.js

const Service = require("../models/serviceModele");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

//backendTache21/controllers/controleurServices.js
const ajouterService = async (req, res) => {
  try {
    const { nomDeservice, categorie, descriptionDeService } = req.body;


    const imageService = req.file ? req.file.filename : "";
    // const imageDiplomes = req.file ? req.file.filename : "";

    // Vérification des champs obligatoires//
    if (!nomDeservice || !categorie || !descriptionDeService ) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Création du service avec les URLs des images
    const nouveauService = new Service({
      nomDeservice,
      categorie,
      descriptionDeService,
      imageService,
      // imageDiplomes,
      prestataire: req.utilisateur.id, // L'ID du prestataire
    });

    // Sauvegarde dans la base de données
    const serviceCree = await nouveauService.save();

    // Retourner les URLs des images dans la réponse
    const serviceWithImageUrls = {
      ...serviceCree.toObject(),
      imageServiceUrl: serviceCree.imageService,
      // imageDiplomesUrl: serviceCree.imageDiplomes,
    };

    res.status(201).json(serviceWithImageUrls);
  } catch (err) {
    console.error("Erreur lors de l'ajout du service :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};



const obtenirTousLesServices = async (req, res) => {
  try {
    // Récupérer tous les services avec les informations des prestataires
    const services = await Service.find().populate("prestataire", "-motDePasse");

    // Ajouter l'URL complète de l'image pour chaque service
    const servicesWithImageUrls = services.map(service => ({
      ...service.toObject(),
      imageUrl: `https://backendtache21.onrender.com/uploads/images/${service.imageService}`,
    }));

    res.status(200).json(servicesWithImageUrls);
  } catch (err) {
    console.error("Erreur lors de la récupération des services :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des services" });
  }
};


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

const modifierService = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomDeservice, categorie, descriptionDeService } = req.body;

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID du service invalide." });
    }

    // Vérifier si le service existe
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service non trouvé." });
    }

    // Vérifier si l'utilisateur connecté est bien le propriétaire du service
    if (service.prestataire.toString() !== req.utilisateur.id) {
      return res.status(403).json({ message: "Accès refusé. Vous ne pouvez modifier que vos propres services." });
    }

    // Mise à jour des champs du service
    service.nomDeservice = nomDeservice || service.nomDeservice;
    service.categorie = categorie || service.categorie;
    service.descriptionDeService = descriptionDeService || service.descriptionDeService;

    // Gestion de l'image si un nouveau fichier est fourni
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (service.imageService) {
        const oldImagePath = path.join(__dirname, "../uploads/images/", service.imageService);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Mettre à jour l'image avec la nouvelle
      service.imageService = req.file.filename;
    }

    // Sauvegarde des modifications
    const serviceModifie = await service.save();

    // Retourner le service mis à jour
    res.status(200).json({
      ...serviceModifie.toObject(),
      imageUrl: `https://backendtache21.onrender.com/uploads/images/${serviceModifie.imageService}`,
    });

  } catch (err) {
    console.error("Erreur lors de la modification du service :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { ajouterService, obtenirDetailService, obtenirTousLesServices, modifierService };







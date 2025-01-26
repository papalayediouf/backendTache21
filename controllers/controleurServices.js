const Service = require("../models/serviceModele");

const ajouterService = async (req, res) => {
  try {
    const {
      nomDeservice,
      categorie,
      descriptionDeService,
    } = req.body;

    const imageService = req.files?.imageService?.[0]?.path.replace("C:/Dev/'Tache 21 Test'/backend", "").replace(/\\/g, "/") || null;
    const imageDiplomes = req.files?.imageDiplomes?.[0]?.path.replace("C:/Dev/'Tache 21 Test'/backend", "").replace(/\\/g, "/") || null;

    // Vérification des champs requis
    if (!nomDeservice || !categorie || !descriptionDeService || !imageService) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Création du nouveau service
    const nouveauService = new Service({
      nomDeservice,
      categorie,
      descriptionDeService,
      imageService,
      imageDiplomes,
      prestataire: req.utilisateur.id, // ID du prestataire lié
    });

    // Sauvegarde dans la base de données
    const serviceCree = await nouveauService.save();
    res.status(201).json(serviceCree);
  } catch (err) {
    console.error("Erreur lors de l'ajout du service :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { ajouterService };

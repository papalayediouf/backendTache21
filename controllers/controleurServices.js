const Service = require("../models/serviceModele");

const ajouterService = async (req, res) => {
  try {
    const { titre, description, prix } = req.body;
    const image = req.file ? req.file.path.replace("C:/Dev/'Tache 21 Test'/backend", "") : null;

    // Vérification des champs
    if (!titre || !description || !prix || !image) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Création d'un nouveau service
    const nouveauService = new Service({
      titre,
      description,
      prix: parseFloat(prix),
      image: image.replace(/\\/g, "/"),
      prestataire: req.utilisateur.id, 
    });

    const serviceCree = await nouveauService.save();
    res.status(201).json(serviceCree);
  } catch (err) {
    console.error("Erreur lors de l'ajout du service :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { ajouterService };

const Favoris = require("../models/favorisModele");
const Admin = require("../models/adminModele");
const Client = require("../models/clientModele");
const Prestataire = require("../models/prestataireModele");
const Service = require("../models/serviceModele");

// Ajouter un service aux favoris
// Ajouter un service aux favoris
exports.ajouterFavori = async (req, res) => {
    try {
      const { utilisateurId, utilisateurType, serviceId } = req.body;
  
      // Vérifier si le type d'utilisateur est valide
      const validTypes = ['admin', 'prestataire', 'client'];
      if (!validTypes.includes(utilisateurType)) {
        return res.status(400).json({ message: "Type d'utilisateur invalide" });
      }
  
      // Vérifier si l'utilisateur existe dans sa collection respective
      let utilisateur;
      switch (utilisateurType) {
        case 'admin':
          utilisateur = await Admin.findById(utilisateurId);
          break;
        case 'prestataire':
          utilisateur = await Prestataire.findById(utilisateurId);
          break;
        case 'client':
          utilisateur = await Client.findById(utilisateurId);
          break;
        default:
          return res.status(400).json({ message: "Type d'utilisateur inconnu" });
      }
  
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Vérifier si le service existe
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service non trouvé" });
      }
  
      // Vérifier si le service est déjà en favoris
      const existeDeja = await Favoris.findOne({ utilisateurId, utilisateurType, serviceId });
      if (existeDeja) {
        return res.status(400).json({ message: "Ce service est déjà en favoris" });
      }
  
      // Ajouter le service aux favoris
      const nouveauFavori = new Favoris({ utilisateurId, utilisateurType, serviceId });
      await nouveauFavori.save();
  
      res.status(201).json({ message: "Service ajouté aux favoris", favori: nouveauFavori });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  };
  

// Supprimer un service des favoris
exports.supprimerFavori = async (req, res) => {
  try {
    const { utilisateurId, utilisateurType, serviceId } = req.body;

    const favori = await Favoris.findOneAndDelete({ utilisateurId, utilisateurType, serviceId });
    if (!favori) {
      return res.status(404).json({ message: "Favori non trouvé" });
    }

    res.status(200).json({ message: "Service retiré des favoris" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Obtenir les favoris d'un utilisateur
exports.getFavoris = async (req, res) => {
  try {
    const { utilisateurId, utilisateurType } = req.params;

    const favoris = await Favoris.find({ utilisateurId, utilisateurType }).populate("serviceId");
    res.status(200).json({ favoris });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
//
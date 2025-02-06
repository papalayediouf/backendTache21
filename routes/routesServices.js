const express = require("express");
const {
  ajouterService,
  obtenirDetailService,
  obtenirTousLesServices,
  modifierService,
} = require("../controllers/controleurServices");
const { verifierToken } = require("../middlewares/authentification");
const verifierRole = require("../middlewares/verifierRole");
const { uploadServiceImage } = require("../middlewares/uploadImage");

const router = express.Router();

// Route pour ajouter un service
router.post(
  "/ajouter",
  (req, res, next) => {
    console.log("Requête reçue sur /ajouter");
    next();
  },
  verifierToken,
  (req, res, next) => {
    console.log("Utilisateur authentifié :", req.utilisateur);
    next();
  },
  verifierRole(["prestataire"]),
  uploadServiceImage,
  ajouterService
);

// Route pour modifier un service
router.put(
  "/modifier/:id",
  verifierToken,
  verifierRole(["prestataire"]),
  uploadServiceImage,
  modifierService
);

// Route pour obtenir tous les services avec les informations des prestataires
router.get("/tous-les-services", obtenirTousLesServices);

// Route pour obtenir les détails d'un service spécifique par ID
router.get("/:id", obtenirDetailService);

module.exports = router;

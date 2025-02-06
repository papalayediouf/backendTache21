const express = require("express");
const { ajouterFavori, supprimerFavori, getFavoris } = require("../controllers/controleurFavoris");

const router = express.Router();

router.post("/ajouter", ajouterFavori);
router.post("/supprimer", supprimerFavori);
router.get("/:utilisateurId/:utilisateurType", getFavoris);

module.exports = router;

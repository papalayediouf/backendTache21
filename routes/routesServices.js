//backend/routes/routesServices.js
const express = require('express');
const { ajouterService , obtenirDetailService , obtenirTousLesServices } = require('../controllers/controleurServices');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');


const { uploadServiceImage ,  uploadDiplomeImage } = require('../middlewares/uploadImage');



const router = express.Router();

// Route pour ajouter un service
router.post(
    '/ajouter',
    (req, res, next) => {
        console.log("Requête reçue sur /ajouter");
        next();
    },
    verifierToken,
    (req, res, next) => {
        console.log("Utilisateur authentifié :", req.utilisateur);
        next();
    },
    verifierRole(['prestataire']),
    uploadServiceImage,
    uploadDiplomeImage,
    ajouterService
);

// toute les services avec information du prestataire 
router.get("/tous-les-services", obtenirTousLesServices);



// id Du service pour l'afficher une seule service
router.get("/:id", obtenirDetailService);




module.exports = router;

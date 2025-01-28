//backend/routes/routesServices.js
const express = require('express');
const { ajouterService , obtenirDetailService } = require('../controllers/controleurServices');
const { verifierToken } = require('../middlewares/authentification');
const verifierRole = require('../middlewares/verifierRole');
const Service = require('../models/serviceModele');
const upload = require('../middlewares/uploadImage');


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
    upload.single("image"),
    ajouterService
);

router.get('/tous-les-services', async (req, res) => {
  try {
    const services = await Service.find();

    const servicesWithImageUrls = services.map(service => ({
      ...service.toObject(),
      imageUrl: `http://localhost:5000/uploads/images/${service.image}`,  
    }));

    res.status(200).json(servicesWithImageUrls);
  } catch (err) {
    console.error('Erreur lors de la récupération des services :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
});
router.get("/tous-les-services/:id", obtenirDetailService);


module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const Prestataire = require('../models/prestataireModele');
const Service = require('../models/serviceModele');
// const Commentaire = require('./models/Commentaire'); // Assurez-vous d'avoir ce modèle
// const Favori = require('./models/Favori'); // Assurez-vous d'avoir ce modèle

const { uploadServiceImage  } = require('../middlewares/uploadImage');


const Info = express.Router();

// Route pour récupérer les détails complets de chaque prestataire
Info.get('/prestataires/complets', async (req, res) => {
    try {
        const prestataires = await Prestataire.find();
        
        const results = await Promise.all(prestataires.map(async (prestataire) => {
            // Récupérer les services liés au prestataire
            const services = await Service.find({ prestataire: prestataire._id });

            const servicesWithImageUrls = services.map(service => ({
                ...service.toObject(),
                imageUrl: `https://backendtache21.onrender.com/uploads/images/${service.imageService}`,  
              }));
            
            // Récupérer les commentaires liés au prestataire
            // const commentaires = await Commentaire.find({ prestataire: prestataire._id });
            
            // Récupérer les favoris liés au prestataire
            // const favoris = await Favori.find({ prestataire: prestataire._id });

            return {
                id: prestataire._id,
                nom: prestataire.nom,
                prenom: prestataire.prenom,
                email: prestataire.email,
                nomEntreprise: prestataire.nomDeLentreprise,
                telephone: prestataire.telephone,
                region: prestataire.region,
                departement: prestataire.departement,
                description: prestataire.description,
                role: prestataire.role,
                services: servicesWithImageUrls.map(service => ({
                    id: service._id,
                    nomService: service.nomDeservice,
                    categorie: service.categorie,
                    description: service.descriptionDeService,
                    imageService: service.imageService,
                    imageDiplomes: service.imageDiplomes,
                    imageUrl: service.imageUrl
                })),

                // commentaires: commentaires.map(comment => ({
                //     id: comment._id,
                //     contenu: comment.contenu,
                //     note: comment.note,
                //     auteur: comment.auteur,
                //     date: comment.createdAt
                // })),
                // favoris: favoris.map(fav => fav.service)
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});


Info.get('/prestataires/complets/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Vérifier que l'ID est un ObjectId valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      }
  
      // Récupérer le prestataire correspondant
      const prestataire = await Prestataire.findById(id);
      if (!prestataire) {
        return res.status(404).json({ message: "Prestataire non trouvé." });
      }
  
      // URL de base fixe
      const baseUrl = "https://backendtache21.onrender.com";
  
      // Récupérer les services associés au prestataire
      const services = await Service.find({ prestataire: prestataire._id });
  
      // Construire la liste des services en ajoutant l'URL complète de l'image
      const servicesList = [];
      for (const service of services) {
        const serviceObj = service.toObject(); // Convertir le document en objet JS
        serviceObj.imageUrl = serviceObj.imageService
          ? `${baseUrl}/uploads/images/${serviceObj.imageService}`
          : null;
  
        servicesList.push({
          id: serviceObj._id,
          nomService: serviceObj.nomDeservice,
          categorie: serviceObj.categorie,
          description: serviceObj.descriptionDeService,
          imageService: serviceObj.imageService,
          imageDiplomes: serviceObj.imageDiplomes,
          imageUrl: serviceObj.imageUrl
        });
      }
  
      // Construction de l'objet de résultat final
      const result = {
        id: prestataire._id,
        nom: prestataire.nom,
        prenom: prestataire.prenom,
        email: prestataire.email,
        nomEntreprise: prestataire.nomDeLentreprise,
        telephone: prestataire.telephone,
        region: prestataire.region,
        departement: prestataire.departement,
        description: prestataire.description,
        role: prestataire.role,
        services: servicesList
      };
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  });
  
  

module.exports = Info;
const express = require('express');
const mongoose = require('mongoose');
const Prestataire = require('../models/prestataireModele');
const Service = require('../models/serviceModele');
// const Commentaire = require('./models/Commentaire'); // Assurez-vous d'avoir ce modèle
// const Favori = require('./models/Favori'); // Assurez-vous d'avoir ce modèle

const Info = express.Router();

// Route pour récupérer les détails complets de chaque prestataire
Info.get('/prestataires/complets', async (req, res) => {
    try {
        const prestataires = await Prestataire.find();
        
        const results = await Promise.all(prestataires.map(async (prestataire) => {
            // Récupérer les services liés au prestataire
            const services = await Service.find({ prestataire: prestataire._id });
            
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
                services: services.map(service => ({
                    id: service._id,
                    nomService: service.nomDeservice,
                    categorie: service.categorie,
                    description: service.descriptionDeService,
                    imageService: service.imageService,
                    imageDiplomes: service.imageDiplomes
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

module.exports = Info;
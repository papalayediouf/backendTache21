//backendTache21/controllers/controleurCategorie.js
const Categorie = require('../models/categorieModele');

// Ajouter une catégorie
exports.ajouterCategorie = async (req, res) => {
    try {
        const { nom } = req.body;

        // Vérifier si la catégorie existe déjà
        const categorieExiste = await Categorie.findOne({ nom });
        if (categorieExiste) {
            return res.status(400).json({ message: "Cette catégorie existe déjà." });
        }

        // Créer une nouvelle catégorie
        const nouvelleCategorie = new Categorie({ nom });
        await nouvelleCategorie.save();

        res.status(201).json({ message: "Catégorie ajoutée avec succès.", categorie: nouvelleCategorie });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

// Afficher toutes les catégories
exports.afficherCategories = async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

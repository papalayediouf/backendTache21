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

// archiver categorie 
// Archiver ou désarchiver une catégorie
exports.archiverCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        const categorie = await Categorie.findById(id);

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }

        categorie.archive = !categorie.archive; // Toggle de l'archivage
        await categorie.save();

        res.status(200).json({ message: `Catégorie ${categorie.archive ? "archivée" : "désarchivée"} avec succès.`, categorie });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

// Afficher toutes les catégories non archivées

exports.afficherCategories = async (req, res) => {
    try {
        // Récupère la valeur du filtre `archive` depuis les paramètres de la requête (true ou false)
        const archive = req.query.archive;

        // Si un paramètre `archive` est passé, filtre selon cette valeur
        const categories = await Categorie.find(archive !== undefined ? { archive: archive === 'true' } : {});

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};



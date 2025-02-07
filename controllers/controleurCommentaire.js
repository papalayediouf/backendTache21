//backendTache21/controllers/controleurCommentaire.js
const Commentaire = require('../models/commentaireModele');

// Ajouter un commentaire
exports.ajouterCommentaire = async (req, res) => {
    try {
        const { contenu, service } = req.body;
        const auteur = req.user.id; // Assurez-vous que l'utilisateur est authentifié

        const nouveauCommentaire = new Commentaire({
            auteur,
            contenu,
            service
        });

        await nouveauCommentaire.save();
        res.status(201).json({ message: "Commentaire ajouté avec succès", commentaire: nouveauCommentaire });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error });
    }
};

// Récupérer les commentaires d'un service
exports.obtenirCommentairesParService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const commentaires = await Commentaire.find({ service: serviceId }).populate('auteur', 'nom email');
        res.status(200).json(commentaires);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error });
    }
};

// Supprimer un commentaire
exports.supprimerCommentaire = async (req, res) => {
    try {
        const { id } = req.params;
        const commentaire = await Commentaire.findById(id);

        if (!commentaire) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // Vérifier si l'utilisateur est l'auteur du commentaire ou un admin
        if (commentaire.auteur.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Action non autorisée" });
        }

        await commentaire.deleteOne();
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du commentaire", error });
    }
};

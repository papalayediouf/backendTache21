const Commentaire = require('../models/commentaireModele');
const Service = require('../models/serviceModele');
const Client = require('../models/clientModele');
const Prestataire = require('../models/prestataireModele');
const Admin = require('../models/adminModele');

//  Fonction pour trouver l'utilisateur dans l'un des trois modèles
const trouverUtilisateur = async (id) => {
    let utilisateur = await Client.findById(id);
    if (utilisateur) return { ...utilisateur.toObject(), role: 'Client' };

    utilisateur = await Prestataire.findById(id);
    if (utilisateur) return { ...utilisateur.toObject(), role: 'Prestataire' };

    utilisateur = await Admin.findById(id);
    if (utilisateur) return { ...utilisateur.toObject(), role: 'Admin' };

    return null;
};

//  Ajouter un commentaire (Seuls les Clients peuvent)
exports.ajouterCommentaire = async (req, res) => {
    try {
        const { serviceId, texte, note } = req.body;
        const utilisateur = await trouverUtilisateur(req.user.id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        if (utilisateur.role !== 'Client') {
            return res.status(403).json({ message: "Seuls les Clients peuvent laisser des commentaires." });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé." });
        }

        const nouveauCommentaire = new Commentaire({
            service: serviceId,
            auteur: req.user.id,
            auteurModel: utilisateur.role, // On enregistre le type d'utilisateur
            texte,
            note
        });

        await nouveauCommentaire.save();
        res.status(201).json({ message: "Commentaire ajouté avec succès.", commentaire: nouveauCommentaire });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

//  Obtenir tous les commentaires d’un service
exports.obtenirCommentaires = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé." });
        }

        const commentaires = await Commentaire.find({ service: serviceId })
            .populate('auteur') // On peut laisser ce populate, mais il récupérera juste l'ID
            .sort({ date: -1 });

        const commentairesAvecDetails = await Promise.all(commentaires.map(async (commentaire) => {
            const utilisateur = await trouverUtilisateur(commentaire.auteur);
            return {
                ...commentaire.toObject(),
                auteur: utilisateur ? { nom: utilisateur.nom, role: utilisateur.role } : null
            };
        }));

        res.status(200).json(commentairesAvecDetails);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

//  Supprimer un commentaire (par l'auteur ou un Admin)
exports.supprimerCommentaire = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur = await trouverUtilisateur(req.user.id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const commentaire = await Commentaire.findById(id);
        if (!commentaire) {
            return res.status(404).json({ message: "Commentaire non trouvé." });
        }

        if (commentaire.auteur.toString() !== req.user.id && utilisateur.role !== 'Admin') {
            return res.status(403).json({ message: "Non autorisé à supprimer ce commentaire." });
        }

        await commentaire.deleteOne();
        res.status(200).json({ message: "Commentaire supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

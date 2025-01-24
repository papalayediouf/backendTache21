// backendTache21/controllers/controleurAdministrateur.js
const Utilisateur = require('../models/utilisateurModele');

// Fonction pour bloquer un prestataire
const bloquerComptePrestataire = async (requete, reponse) => {
    const { idPrestataire } = requete.params; 

    try {
        const prestataire = await Utilisateur.findById(idPrestataire);

        if (!prestataire) {
            return reponse.status(404).json({ message: 'Prestataire non trouvé.' });
        }

        if (prestataire.role !== 'prestataire') {
            return reponse.status(400).json({ message: 'Cet utilisateur n\'est pas un prestataire.' });
        }

        prestataire.actif = false; // Désactiver le compte
        await prestataire.save();

        reponse.status(200).json({ message: 'Compte prestataire bloqué avec succès.' });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({ message: 'Erreur lors du blocage du compte prestataire.' });
    }
};

// Fonction pour débloquer un prestataire
const debloquerComptePrestataire = async (requete, reponse) => {
    const { idPrestataire } = requete.params; 

    try {
        const prestataire = await Utilisateur.findById(idPrestataire);

        if (!prestataire) {
            return reponse.status(404).json({ message: 'Prestataire non trouvé.' });
        }

        if (prestataire.role !== 'prestataire') {
            return reponse.status(400).json({ message: 'Cet utilisateur n\'est pas un prestataire.' });
        }

        prestataire.actif = true; 
        await prestataire.save();

        reponse.status(200).json({ message: 'Compte prestataire débloqué avec succès.' });
    } catch (erreur) {
        console.error(erreur);
        reponse.status(500).json({ message: 'Erreur lors du déblocage du compte prestataire.' });
    }
};

// Exportation des fonctions
module.exports = {
    bloquerComptePrestataire,
    debloquerComptePrestataire,
};

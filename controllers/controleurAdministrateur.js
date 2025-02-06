//backendTache21/controllers/controleurAdministrateur.js
const Administrateur = require('../models/adminModele');
const bcrypt = require('bcryptjs');
const Prestataire = require('../models/prestataireModele'); 


// Fonction pour récupérer le profil de l'administrateur
const profilAdministrateur = async (requete, reponse) => {
  const { id } = requete.utilisateur;  // Récupérer l'ID de l'administrateur à partir du token (middleware)

  try {
    const administrateur = await Administrateur.findById(id).select('-motDePasse'); // Exclure le mot de passe

    if (!administrateur) {
      return reponse.status(404).json({ message: 'Administrateur non trouvé.' });
    }

    reponse.status(200).json({
      administrateur: {
        id: administrateur._id,
        nom: administrateur.nom,
        email: administrateur.email,
        role: administrateur.role,
        // autres informations pertinentes...
      },
    });
  } catch (erreur) {
    console.error('Erreur lors de la récupération du profil administrateur:', erreur);
    return reponse.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Fonction pour modifier le profil de l'administrateur
const modifierProfilAdministrateur = async (requete, reponse) => {
  const { id } = requete.utilisateur;  // Récupérer l'ID de l'administrateur à partir du token (middleware)
  const { nom, email, motDePasse } = requete.body;

  try {
    // Récupérer l'administrateur
    const administrateur = await Administrateur.findById(id);

    if (!administrateur) {
      return reponse.status(404).json({ message: 'Administrateur non trouvé.' });
    }

    // Mettre à jour les informations
    if (nom) administrateur.nom = nom;
    if (email) administrateur.email = email;

    // Si un mot de passe est fourni, le hacher et l'ajouter
    if (motDePasse) {
      administrateur.motDePasse = await bcrypt.hash(motDePasse, 10);
    }

    // Sauvegarder les modifications
    await administrateur.save();

    reponse.status(200).json({
      message: 'Profil administrateur mis à jour avec succès.',
      administrateur: {
        id: administrateur._id,
        nom: administrateur.nom,
        email: administrateur.email,
        role: administrateur.role,
      },
    });
  } catch (erreur) {
    console.error('Erreur lors de la mise à jour du profil administrateur:', erreur);
    return reponse.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Fonction pour bloquer un prestataire
const bloquerComptePrestataire = async (requete, reponse) => {
  const { idPrestataire } = requete.params;

  try {
    const prestataire = await Prestataire.findById(idPrestataire);

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
    const prestataire = await Prestataire.findById(idPrestataire);

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
  profilAdministrateur,
  modifierProfilAdministrateur,
  bloquerComptePrestataire,
  debloquerComptePrestataire,
};

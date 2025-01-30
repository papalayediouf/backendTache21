const bcrypt = require('bcryptjs');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');


// Inscription d'un prestataire

const inscriptionPrestataire = async (req, res) => {
  const { nom, prenom, email, telephone, motDePasse, nomDeLentreprise, region, departement, description } = req.body;

  try {
    // Vérifier si un prestataire existe déjà avec cet email
    const prestataireExistant = await Prestataire.findOne({ email });
    if (prestataireExistant) {
      return res.status(400).json({ message: "Un prestataire avec cet email existe déjà." });
    }

    // Vérifier si l'utilisateur est un client existant
    const clientExistant = await Client.findOne({ email });

    // Créer un nouveau prestataire
    const prestataire = new Prestataire({
      nom,
      prenom,
      email,
      telephone,
      motDePasse: await bcrypt.hash(motDePasse, 10),
      nomDeLentreprise,
      region,
      departement,
      description,
    });

    // Sauvegarder le prestataire dans la base de données
    await prestataire.save();

    // Si un client existant est trouvé, supprimer son compte
    if (clientExistant) {
      await Client.deleteOne({ email });
      console.log(`Compte client supprimé pour l'email : ${email}`);
    }

    res.status(201).json({
      message: "Inscription réussie. Vous êtes maintenant un prestataire.",
      prestataire: {
        id: prestataire._id,
        nom: prestataire.nom,
        prenom: prestataire.prenom,
        email: prestataire.email,
        telephone: prestataire.telephone,
        nomDeLentreprise: prestataire.nomDeLentreprise,
        region: prestataire.region,
        departement: prestataire.departement,
        description: prestataire.description,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Récupérer le profil du prestataire  
const profilPrestataire = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est bien authentifié
    if (!req.utilisateur || !req.utilisateur._id) {
      return res.status(401).json({ message: 'Accès non autorisé.' });
    }

    // Récupérer l'ID depuis le token JWT
    const id = req.utilisateur._id;

    // Trouver le prestataire par son ID (sans le mot de passe)
    const prestataire = await Prestataire.findById(id).select('-motDePasse');

    if (!prestataire) {
      return res.status(404).json({ message: 'Prestataire non trouvé.' });
    }

    // Retourner les informations du profil
    return res.status(200).json({
      prestataire: {
        id: prestataire._id,
        nom: prestataire.nom,
        prenom: prestataire.prenom,
        email: prestataire.email,
        telephone: prestataire.telephone,
        nomDeLentreprise: prestataire.nomDeLentreprise,
        region: prestataire.region,
        departement: prestataire.departement,
        description: prestataire.description,
      },
    });
  } catch (erreur) {
    console.error("Erreur lors de la récupération du profil :", erreur);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Lister tous les prestataires
const listerPrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.find().select('-motDePasse'); // Exclure le mot de passe
    res.status(200).json(prestataires);
  } catch (error) {
    console.error("Erreur lors de la récupération des prestataires :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

const supprimerDemandeReservation = async (req, res) => {
  const { demandeId } = req.params; // Récupérer l'ID de la demande de réservation à supprimer

  try {
    // Vérifier si la demande existe
    const demande = await ReservationRequest.findById(demandeId);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée.' });
    }

    // Vérifier si le prestataire est celui auquel la demande appartient
    if (demande.prestataireId.toString() !== req.utilisateur._id.toString()) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette demande.' });
    }

    // Supprimer la demande
    await demande.deleteOne();

    res.status(200).json({ message: 'Demande supprimée avec succès.' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande :", error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


module.exports = {
  inscriptionPrestataire,
  profilPrestataire,
  listerPrestataires, 
  supprimerDemandeReservation,
};


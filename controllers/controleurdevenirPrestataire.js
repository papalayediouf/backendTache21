//backendTache21/controllers/controleurdevenirPrestataire.js
const bcrypt = require('bcryptjs');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');


// Inscription d'un prestataire

const inscriptionPrestataire = async (req, res) => {
  const { nom, prenom, email, telephone, motDePasse, nomDeLentreprise, region, departement, description } = req.body;

  try {
    const prestataireExistant = await Prestataire.findOne({ email });
    if (prestataireExistant) {
      return res.status(400).json({ message: "Un prestataire avec cet email existe déjà." });
    }

    const clientExistant = await Client.findOne({ email });

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
      actif: true, 
    });

    await prestataire.save();
//
    if (clientExistant) {
      await Client.findByIdAndDelete(clientExistant._id);
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
  const { id } = req.utilisateur;

  try {
    const prestataire = await Prestataire.findById(id);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé." });
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

//modifier le profil du prestataire
const modifierProfilPrestataire = async (req, res) => {
  const { id } = req.utilisateur; // Récupérer l'ID du prestataire connecté
  const { nom, prenom, telephone, nomDeLentreprise, region, departement, description, motDePasse } = req.body;

  try {
    // Vérifier si le prestataire existe
    const prestataire = await Prestataire.findById(id);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé." });
    }

    // Mettre à jour les champs fournis
    if (nom) prestataire.nom = nom;
    if (prenom) prestataire.prenom = prenom;
    if (telephone) prestataire.telephone = telephone;
    if (nomDeLentreprise) prestataire.nomDeLentreprise = nomDeLentreprise;
    if (region) prestataire.region = region;
    if (departement) prestataire.departement = departement;
    if (description) prestataire.description = description;

    // Si l'utilisateur veut modifier son mot de passe
    if (motDePasse) {
      prestataire.motDePasse = await bcrypt.hash(motDePasse, 10);
    }

    // Sauvegarde des modifications
    await prestataire.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
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
    console.error("Erreur lors de la modification du profil :", erreur);
    res.status(500).json({ message: "Erreur interne du serveur." });
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
  modifierProfilPrestataire,
  listerPrestataires, 
  supprimerDemandeReservation,
};


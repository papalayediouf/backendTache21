//backendTache21/controllers/controleurdevenirPrestataire.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Prestataire = require('../models/prestataireModele');

// Inscription d'un prestataire (transformation d'un utilisateur en prestataire)
const inscriptionPrestataire = async (req, res) => {
  const { nom, prenom, email, motDePasse, telephone, nomEntreprise, region, description, services } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Créer un nouvel utilisateur
    const utilisateur = new Utilisateur({
      nom,
      prenom,
      email,
      motDePasse: await bcrypt.hash(motDePasse, 10), // Hash le mot de passe avant de le sauvegarder
      role: 'prestataire', // On attribue le rôle 'prestataire' directement à l'inscription
    });

    // Sauvegarder l'utilisateur dans la base de données
    await utilisateur.save();

    // Créer un objet prestataire
    const prestataire = new Prestataire({
      _id: utilisateur._id, // Utiliser l'ID de l'utilisateur pour le prestataire
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      motDePasse: utilisateur.motDePasse, // Garder le mot de passe
      nomEntreprise,
      description,
      telephone,
      region,
      services,
    });

    // Sauvegarder le prestataire
    await prestataire.save();

    res.status(201).json({
      message: "Inscription réussie. Vous êtes maintenant un prestataire.",
      prestataire: {
        id: prestataire._id,
        nom: prestataire.nom,
        prenom: prestataire.prenom,
        email: prestataire.email,
        nomEntreprise: prestataire.nomEntreprise,
        description: prestataire.description,
        telephone: prestataire.telephone,
        region: prestataire.region,
        services: prestataire.services,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Connexion d'un prestataire
const connexionPrestataire = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // Trouver l'utilisateur par son email
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Comparer le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: utilisateur._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Connexion réussie.",
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Devenir prestataire en utilisant un utilisateur existant
const devenirPrestataire = async (req, res) => {
  const { description, nomEntreprise, telephone, region, services } = req.body;

  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifie si l'utilisateur est déjà un prestataire
    if (utilisateur.role === 'prestataire') {
      return res.status(400).json({ message: "Vous êtes déjà un prestataire." });
    }

    // Transformation en prestataire
    utilisateur.role = 'prestataire';

    // Créer un objet prestataire
    const prestataire = new Prestataire({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      motDePasse: utilisateur.motDePasse,
      nomEntreprise,
      description,
      telephone,
      region,
      services,
    });

    // Sauvegarder le prestataire
    await prestataire.save();

    res.status(200).json({
      message: "Vous êtes maintenant un prestataire.",
      prestataire: {
        id: prestataire._id,
        nom: prestataire.nom,
        prenom: prestataire.prenom,
        email: prestataire.email,
        nomEntreprise: prestataire.nomEntreprise,
        description: prestataire.description,
        telephone: prestataire.telephone,
        region: prestataire.region,
        services: prestataire.services,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la transformation en prestataire :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// **Obtenir les informations du profil du prestataire**
const obtenirProfilPrestataire= async (req, res) => {
    try {
      // Récupérer l'id du prestataire à partir du JWT
      const prestataire = await Prestataire.findById(req.utilisateur.id);
  
      // Vérifier si le prestataire existe
      if (!prestataire) {
        return res.status(404).json({ message: "Prestataire non trouvé." });
      }
  
      // Renvoyer les informations du prestataire
      res.status(200).json({
        prestataire: {
          id: prestataire._id,
          nom: prestataire.nom,
          prenom: prestataire.prenom,
          email: prestataire.email,
          nomEntreprise: prestataire.nomEntreprise,
          description: prestataire.description,
          telephone: prestataire.telephone,
          region: prestataire.region,
          services: prestataire.services,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil du prestataire :", error.message);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  };




// Liste des prestataires
const listePrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.find({}).select('-motDePasse'); // Exclut le mot de passe

    res.status(200).json(prestataires);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des prestataires :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Mettre à jour les informations du prestataire
const mettreAJourPrestataire = async (req, res) => {
  const { description, nomEntreprise, telephone, region, services } = req.body;

  try {
    const prestataire = await Prestataire.findById(req.utilisateur.id);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé." });
    }

    // Mettre à jour les champs
    prestataire.description = description || prestataire.description;
    prestataire.nomEntreprise = nomEntreprise || prestataire.nomEntreprise;
    prestataire.telephone = telephone || prestataire.telephone;
    prestataire.region = region || prestataire.region;
    prestataire.services = services || prestataire.services;

    await prestataire.save();

    res.status(200).json({
      message: "Informations mises à jour avec succès.",
      prestataire,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du prestataire :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = {
  inscriptionPrestataire,
  connexionPrestataire,
  devenirPrestataire,
  obtenirProfilPrestataire,
  listePrestataires,
  mettreAJourPrestataire,
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateurModele');
const Prestataire = require('../models/prestataireModele');

// Fonction pour générer un token JWT
const genererToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// **Inscription d'un utilisateur (Client ou Prestataire)**
const inscription = async (req, res) => {
  const { nom, prenom, email, motDePasse, role, ...detailsSpecifiques } = req.body;

  try {
    // Vérifie si l'email existe déjà
    const utilisateurExiste = await Utilisateur.findOne({ email });
    if (utilisateurExiste) {
      return res.status(400).json({ message: "Cet email est déjà enregistré." });
    }

    let utilisateur;
    if (role === 'prestataire') {
      // Création d'un prestataire
      utilisateur = await Prestataire.create({ 
        nom, 
        prenom, 
        email, 
        motDePasse, 
        role, 
        ...detailsSpecifiques 
      });
    } else {
      // Création d'un client (ou utilisateur par défaut)
      utilisateur = await Utilisateur.create({ 
        nom, 
        prenom, 
        email, 
        motDePasse, 
        role: 'client' 
      });
    }

    res.status(201).json({
      message: `Inscription réussie en tant que ${utilisateur.role}.`,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      token: genererToken(utilisateur._id, utilisateur.role),
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// **Connexion de l'utilisateur**
const connexion = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
    }

    res.json({
      message: "Connexion réussie.",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      token: genererToken(utilisateur._id, utilisateur.role),
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// **Devenir Prestataire (depuis un compte Client existant)**
const devenirPrestataire = async (req, res) => {
  const { id } = req.utilisateur; // ID récupéré depuis le middleware d'authentification
  const { adresse, telephone, description, services } = req.body;

  try {
    const utilisateur = await Utilisateur.findById(id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (utilisateur.role === 'prestataire') {
      return res.status(400).json({ message: "Vous êtes déjà un prestataire." });
    }

    // Mise à jour du rôle et des champs spécifiques au prestataire
    utilisateur.role = 'prestataire';
    utilisateur.adresse = adresse;
    utilisateur.telephone = telephone;
    utilisateur.description = description;
    utilisateur.services = services;

    await utilisateur.save();

    res.status(200).json({
      message: "Vous êtes maintenant un prestataire.",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      token: genererToken(utilisateur._id, utilisateur.role),
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { inscription, connexion, devenirPrestataire };

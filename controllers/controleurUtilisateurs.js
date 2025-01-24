
//backend/controllers/controleurUtilisateurs.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateurModele');

// Fonction pour générer un token JWT
const genererToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Inscription
const inscription = async (req, res) => {
    const { nom, email, motDePasse } = req.body;

    try {
        // Vérifie si l'email existe déjà
        const utilisateurExiste = await Utilisateur.findOne({ email });
        if (utilisateurExiste) {
            return res.status(400).json({ message: "L'email existe déjà." });
        }

        // Création de l'utilisateur
        const utilisateur = await Utilisateur.create({ nom, email, motDePasse });

        // Réponse de succès avec un message clair
        res.status(201).json({
            message: "Inscription réussie. Vous pouvez maintenant vous connecter.",
            id: utilisateur._id,
            nom: utilisateur.nom,
            prenom: utilisateur.nom,
            email: utilisateur.email,
            role: utilisateur.role,
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error.message);

        // Gestion des erreurs
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Données invalides.", details: error.errors });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: "Cet email est déjà enregistré." });
        }

        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

// Connexion
const connexion = async (req, res) => {
    const { email, motDePasse } = req.body;

    console.log("Requête reçue :", req.body);

    try {
        const utilisateur = await Utilisateur.findOne({ email });

        if (!utilisateur) {
            console.log("Email introuvable :", email);
            return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
        }

        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

        if (!motDePasseValide) {
            console.log("Mot de passe incorrect pour :", email);
            return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
        }

        console.log("Connexion réussie pour :", utilisateur.nom);

        res.json({
            id: utilisateur._id,
            nom: utilisateur.nom,
            email: utilisateur.email,
            role: utilisateur.role,
            token: genererToken(utilisateur._id, utilisateur.role),
        });
    } catch (err) {
        console.error("Erreur interne :", err.message);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

const Prestataire = require('../models/prestataireModele');

// Fonction pour devenir prestataire
const devenirPrestataire = async (req, res) => {
    const { email, adresse, telephone, description } = req.body;
  
    try {
      // Vérifie si l'utilisateur existe
      const utilisateur = await Utilisateur.findOne({ email });
  
      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      if (utilisateur.role === 'prestataire') {
        return res.status(400).json({ message: "Cet utilisateur est déjà un prestataire." });
      }
  
      // Met à jour le rôle et les informations nécessaires
      utilisateur.role = 'prestataire';
      utilisateur.adresse = adresse;
      utilisateur.telephone = telephone;
      utilisateur.description = description;
  
      await utilisateur.save(); // Sauvegarde les modifications dans la base de données
  
      // Génère un nouveau token avec le rôle mis à jour
      const token = genererToken(utilisateur._id, utilisateur.role);
  
      res.status(200).json({
        message: "Vous êtes maintenant un prestataire.",
        utilisateur: {
          id: utilisateur._id,
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
        },
        token, // Retourne le nouveau token
      });
    } catch (error) {
      console.error("Erreur lors du changement de rôle :", error.message);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  };
  





module.exports = { inscription, connexion, devenirPrestataire };

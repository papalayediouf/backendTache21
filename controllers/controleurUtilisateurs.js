const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');
const Admin = require('../models/adminModele');

// Fonction pour générer un token JWT
const genererToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// **Connexion (Admin, Client, Prestataire)**
// **Connexion (Admin, Client, Prestataire)**
const connexion = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // Vérifier si l'utilisateur est un admin
    let utilisateur = await Admin.findOne({ email });

    if (!utilisateur) {
      // Vérifier si l'utilisateur est un prestataire
      utilisateur = await Prestataire.findOne({ email });

      // Vérifier si le prestataire est inactif
      if (utilisateur && !utilisateur.actif) {
        return res.status(403).json({ message: "Votre compte est inactif. Veuillez contacter l'administration." });
      }
    }

    if (!utilisateur) {
      // Vérifier si l'utilisateur est un client
      utilisateur = await Client.findOne({ email });
    }

    // Si aucun utilisateur trouvé
    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect." });
    }

    // Vérification du mot de passe
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

module.exports = { connexion };

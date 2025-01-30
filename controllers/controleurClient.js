const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../models/clientModele');

// **Inscription d'un client**
const inscriptionClient = async (req, res) => {
  const { nom, prenom, email, motDePasse } = req.body;

  try {
    // Vérifier si un client avec cet email existe déjà
    const clientExist = await Client.findOne({ email });
    if (clientExist) {
      return res.status(400).json({ message: "Un client avec cet email existe déjà." });
    }

    // Hash du mot de passe
    const motDePasseHashe = await bcrypt.hash(motDePasse, 10);

    // Création du nouveau client
    const nouveauClient = new Client({
      nom,
      prenom,
      email,
      motDePasse: motDePasseHashe,
      role: 'client',
    });

    // Sauvegarde du client dans la base de données
    await nouveauClient.save();

    // Générer un token JWT
    const token = jwt.sign({ id: nouveauClient._id, email: nouveauClient.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: "Client inscrit avec succès.",
      client: {
        id: nouveauClient._id,
        nom: nouveauClient.nom,
        prenom: nouveauClient.prenom,
        email: nouveauClient.email,
        role: nouveauClient.role,
      },
      token, // Envoi du token au client
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription du client :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};




// **Récupérer les informations d'un client**
const obtenirClient = async (req, res) => {
  const { id } = req.utilisateur;

  try {
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    res.status(200).json({
      id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      role: client.role,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du client :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// **Mettre à jour les informations du client**
const mettreAJourClient = async (req, res) => {
  const { id } = req.utilisateur; // ID récupéré depuis le middleware
  const { nom, prenom, email } = req.body;

  try {
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    client.nom = nom || client.nom;
    client.prenom = prenom || client.prenom;
    client.email = email || client.email;

    await client.save();

    res.status(200).json({
      message: "Informations du client mises à jour avec succès.",
      client: {
        
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
       
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// **Supprimer un compte client**
const supprimerCompteClient = async (req, res) => {
  const { id } = req.utilisateur;

  try {
    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    res.status(200).json({ message: "Compte client supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// **Liste des clients (Admin uniquement)**
const listeClients = async (req, res) => {
  try {
    const clients = await Client.find({ role: 'client' }).select('-motDePasse'); // On exclut le mot de passe

    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

module.exports = {
  inscriptionClient,
  obtenirClient,
  mettreAJourClient,
  supprimerCompteClient,
  listeClients,
};

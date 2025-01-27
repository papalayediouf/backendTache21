const bcrypt = require('bcryptjs');
const Prestataire = require('../models/prestataireModele');

// Inscription d'un prestataire
const inscriptionPrestataire = async (req, res) => {
  const { nom, prenom, email ,telephone, motDePasse, nomDeLentreprise ,  region,  departement ,description} = req.body;

  try {
    // Vérifier si un prestataire existe déjà avec cet email
    const prestataireExistant = await Prestataire.findOne({ email });
    if (prestataireExistant) {
      return res.status(400).json({ message: "Un prestataire avec cet email existe déjà." });
    }

    // Créer un nouvel prestataire
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

    res.status(201).json({
      message: "Inscription réussie. Vous êtes maintenant un prestataire.",
      prestataire: {
        id: prestataire._id,
        nom: prestataire.nom,
        prenom: prestataire.prenom,
        email: prestataire.email,
        telephone: prestataire.telephone,
        motDePasse: prestataire.motDePasse,
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

module.exports = {
  inscriptionPrestataire,
};

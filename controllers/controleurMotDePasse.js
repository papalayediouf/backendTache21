const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');

// Demande de réinitialisation de mot de passe
const demanderReinitialisationMotDePasse = async (requete, reponse) => {
  const { email } = requete.body;

  try {
    // Chercher l'utilisateur dans le modèle Prestataire ou Client
    let utilisateur = await Prestataire.findOne({ email });
    if (!utilisateur) {
      utilisateur = await Client.findOne({ email });
    }

    if (!utilisateur) {
      return reponse.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const codeReset = crypto.randomInt(100000, 999999).toString();
    const hashCode = crypto.createHash('sha256').update(codeReset).digest('hex');

    utilisateur.codeReset = hashCode;
    utilisateur.codeResetExpire = Date.now() + 3600000; 
    await utilisateur.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Réinitialisation de mot de passe',
      text: `Votre code de réinitialisation est : ${codeReset}`,
    };

    await transporter.sendMail(mailOptions);
    reponse.json({ message: 'Code de réinitialisation envoyé à votre email.' });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la demande de réinitialisation.' });
  }
};

// Fonction pour réinitialiser le mot de passe
const reinitialiserMotDePasse = async (requete, reponse) => {
  const { email, codeReset, nouveauMotDePasse } = requete.body;

  try {
    const hashedCodeReset = crypto.createHash('sha256').update(codeReset).digest('hex');

    // Chercher l'utilisateur dans les modèles Prestataire et Client.
    let utilisateur = await Prestataire.findOne({
      email,
      codeReset: hashedCodeReset,
      codeResetExpire: { $gt: Date.now() },
    });

    if (!utilisateur) {
      utilisateur = await Client.findOne({
        email,
        codeReset: hashedCodeReset,
        codeResetExpire: { $gt: Date.now() },
      });
    }

    if (!utilisateur) {
      return reponse.status(400).json({ message: 'Code invalide ou expiré.' });
    }

    utilisateur.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10);
    utilisateur.codeReset = undefined;
    utilisateur.codeResetExpire = undefined;
    await utilisateur.save();

    reponse.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (erreur) {
    console.error(erreur);
    reponse.status(500).json({ message: 'Erreur lors de la réinitialisation.' });
  }
};

module.exports = {
  demanderReinitialisationMotDePasse,
  reinitialiserMotDePasse,
};

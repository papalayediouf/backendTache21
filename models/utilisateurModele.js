///backend/models/utilisateurModele.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma utilisateur
const utilisateurSchema = mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    motDePasse: { type: String, required: true },
    role: {
      type: String,
      enum: ['client', 'prestataire', 'admin'],
      default: 'client',
    },
  },
  { timestamps: true } // Ajout des champs "createdAt" et "updatedAt"
);

// Middleware pour hacher le mot de passe avant sauvegarde
utilisateurSchema.pre('save', async function (next) {
  // Si le mot de passe n'est pas modifié, passer au middleware suivant
  if (!this.isModified('motDePasse')) {
    return next();
  }

  try {
    // Hachage du mot de passe
    this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
    next();
  } catch (error) {
    next(error); // Propager l'erreur si le hachage échoue
  }
});

// Méthode pour comparer les mots de passe
utilisateurSchema.methods.verifierMotDePasse = async function (motDePasseEnClair) {
  return bcrypt.compare(motDePasseEnClair, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);

const mongoose = require('mongoose');
const Commentaire = require('../models/commentaireModele'); // Importer le modèle Commentaire

// Ajouter un commentaire
exports.ajouterCommentaire = async (req, res) => {
  const { serviceId } = req.params;
  const { commentaire, note } = req.body; // Inclure note dans le body

  // Vérification de la note
  if (!note || note < 1 || note > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
  }

  try {
    const nouveauCommentaire = new Commentaire({
      service: serviceId,
      commentaire: commentaire,
      note: note, // Ajouter la note au commentaire
      date: new Date() // Ajouter la date automatiquement
    });

    await nouveauCommentaire.save();
    res.status(201).json({ message: 'Commentaire ajouté avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire' });
  }
};

// Récupérer tous les commentaires pour un service
exports.getCommentaires = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const commentaires = await Commentaire.find({ service: serviceId });
    res.status(200).json(commentaires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
  }
};

// Modifier un commentaire
exports.modifierCommentaire = async (req, res) => {
  const { id } = req.params;
  const { commentaire, note } = req.body; // Inclure note dans le body

  // Vérification de la note
  if (!note || note < 1 || note > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
  }

  try {
    const commentaireExistant = await Commentaire.findById(id);
    if (!commentaireExistant) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    commentaireExistant.commentaire = commentaire;
    commentaireExistant.note = note; // Mettre à jour la note
    await commentaireExistant.save();

    res.status(200).json({ message: 'Commentaire mis à jour avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification du commentaire' });
  }
};

// Supprimer un commentaire
exports.supprimerCommentaire = async (req, res) => {
  const { id } = req.params;

  try {
    const commentaire = await Commentaire.findById(id);
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    await Commentaire.findByIdAndDelete(id);
    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
  }
};

// Statistiques des notes par étoiles pour un service
// Statistiques des notes par étoiles pour un service
exports.statistiqueNotes = async (req, res) => {
    const { serviceId } = req.params;
  
    try {
      // Convertir serviceId en ObjectId
      const objectId = new mongoose.Types.ObjectId(serviceId); // Ajoutez "new"
  
      // Agrégation pour compter les occurrences de chaque note
      const statistiques = await Commentaire.aggregate([
        { $match: { service: objectId } }, // Filtrer par service avec ObjectId
        { $group: { _id: "$note", count: { $sum: 1 } } }, // Compter les notes
        { $sort: { _id: 1 } } // Trier par note (1 à 5)
      ]);
  
      // Ajouter les notes manquantes pour que la statistique soit toujours complète (1-5)
      const notesStatistiques = [1, 2, 3, 4, 5].map((note) => {
        const stat = statistiques.find((stat) => stat._id === note);
        return { note, count: stat ? stat.count : 0 }; // Si la note n'est pas présente, la compter comme 0
      });
  
      res.status(200).json(notesStatistiques);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques des notes' });
    }
  };
  

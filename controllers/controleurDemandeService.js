const DemandeService = require('../models/demandeServiceModele');
const transporter = require('../config/emailConfig');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');
const Admin = require('../models/adminModele');

/// **Créer une demande de service**
const creerDemandeService = async (req, res) => {
    try {
        const { typeService, numeroTelephone, description, date, prestataireId } = req.body;

        if (!typeService || !numeroTelephone || !description || !date || !prestataireId) {
            return res.status(400).json({ message: 'Veuillez fournir toutes les informations nécessaires.' });
        }

        const prestataire = await Prestataire.findById(prestataireId);
        if (!prestataire) {
            return res.status(404).json({ message: 'Prestataire non trouvé.' });
        }
//
        const utilisateur = await Client.findById(req.utilisateur._id) ||
            await Prestataire.findById(req.utilisateur._id) ||
            await Admin.findById(req.utilisateur._id);
        if (!utilisateur) {
            return res.status(403).json({ message: "Seuls les utilisateurs connectés peuvent créer une demande de service." });
        }

        const nouvelleDemande = new DemandeService({
            typeService,
            numeroTelephone,
            description,
            date,
            utilisateur: req.utilisateur._id,
            prestataire: prestataireId,
            statut: 'en attente',
        });

        await nouvelleDemande.save();

        if (prestataire.email) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: prestataire.email,
                subject: 'Nouvelle demande de service reçue',
                html: `
                    <h3>Bonjour ${prestataire.nom},</h3>
                    <p>Vous avez reçu une nouvelle demande de service :</p>
                    <ul>
                        <li><strong>Type de service :</strong> ${typeService}</li>
                        <li><strong>Numéro de téléphone :</strong> ${numeroTelephone}</li>
                        <li><strong>Description :</strong> ${description}</li>
                        <li><strong>Date :</strong> ${date}</li>
                    </ul>
                    <p>Veuillez vous connecter à votre compte pour consulter les détails et répondre à cette demande.</p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erreur envoi email :', error.message);
                } else {
                    console.log('Email envoyé :', info.response);
                }
            });
        }

        res.status(201).json({ message: 'Demande de service créée et envoyée.', demande: nouvelleDemande });
    } catch (error) {
        console.error('Erreur création demande :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Obtenir toutes les demandes avec les infos du créateur (Admin)**
const obtenirToutesLesDemandes = async (req, res) => {
    try {
        // Récupérer toutes les demandes
        const demandes = await DemandeService.find();

        // Récupérer les informations du client et du prestataire pour chaque demande
        const demandesAvecInfo = await Promise.all(demandes.map(async (demande) => {
            const client = await Client.findById(demande.client);
            const prestataire = await Prestataire.findById(demande.prestataire);

            return {
                ...demande.toObject(),  // Convertir mongoose document en objet pur
                client: client ? { nom: client.nom, email: client.email } : null,
                prestataire: prestataire ? { nom: prestataire.nom, email: prestataire.email } : null,
            };
        }));

        // Calculer le nombre total de demandes
        const totalDemandes = demandes.length;

        // Retourner la réponse avec les demandes et le total
        res.status(200).json({
            message: 'Demandes récupérées.',
            totalDemandes, // Ajouter le total des demandes
            demandes: demandesAvecInfo, // Ajouter les demandes avec les infos du client et prestataire
        });
    } catch (error) {
        console.error('Erreur récupération demandes :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};





/// **Obtenir les demandes d'un client connecté**
const obtenirDemandesParClient = async (req, res) => {
    try {
        const demandes = await DemandeService.find({ utilisateur: req.utilisateur._id })
            .populate('prestataire', 'nom email');

        res.status(200).json({ message: 'Demandes récupérées.', demandes });
    } catch (error) {
        console.error('Erreur récupération demandes client :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Obtenir les demandes d'un prestataire connecté**
const obtenirDemandesParPrestataire = async (req, res) => {
    try {
        const demandes = await DemandeService.find({ prestataire: req.utilisateur._id })
            .populate('utilisateur', 'nom email');

        res.status(200).json({ message: 'Demandes récupérées.', demandes });
    } catch (error) {
        console.error('Erreur récupération demandes prestataire :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Mettre à jour le statut d'une demande**
const mettreAJourStatutDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const statutsValides = ['acceptée', 'refusée', 'terminée'];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ message: 'Statut invalide.' });
        }

        const demande = await DemandeService.findById(id);
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée.' });
        }

        if (req.utilisateur._id.toString() !== demande.prestataire.toString()) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette demande." });
        }

        demande.statut = statut;
        await demande.save();

        res.status(200).json({ message: 'Statut mis à jour.', demande });
    } catch (error) {
        console.error('Erreur mise à jour statut :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

module.exports = {
    creerDemandeService,
    obtenirToutesLesDemandes,
    obtenirDemandesParClient,
    obtenirDemandesParPrestataire,
    mettreAJourStatutDemande,
};

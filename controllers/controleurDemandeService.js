const DemandeService = require('../models/demandeServiceModele');
const transporter = require('../config/emailConfig');
const Prestataire = require('../models/prestataireModele');
const Client = require('../models/clientModele');
const Admin = require('../models/adminModele'); // Configuration de Nodemailer

/// **Créer une demande de service et l'envoyer à un prestataire**
const creerDemandeService = async (req, res) => {
    try {
        const { typeService, numeroTelephone, description, adresse, date, prestataireId } = req.body;

        // Vérifie que toutes les informations nécessaires sont présentes
        if (!typeService || !numeroTelephone || !description || !adresse || !date || !prestataireId) {
            return res.status(400).json({ message: 'Veuillez fournir toutes les informations nécessaires.' });
        }

        // Vérifie si le prestataire existe et qu'il a le bon rôle
        const prestataire = await Prestataire.findById(prestataireId);
        if (!prestataire || prestataire.role !== 'prestataire') {
            return res.status(404).json({ message: 'Prestataire non trouvé ou rôle invalide.' });
        }

        // Crée une nouvelle demande de service
        const nouvelleDemande = new DemandeService({
            typeService,
            numeroTelephone,
            description,
            adresse,
            date,
            demandeur: req.utilisateur.id, // Client connecté
            prestataire: prestataireId,
            statut: 'en attente', // Statut initial
        });

        // Sauvegarde la demande
        await nouvelleDemande.save();

        // Prépare et envoie un email au prestataire
        const mailOptions = {
            from: process.env.EMAIL_USER, // Adresse email de l'expéditeur
            to: prestataire.email, // Adresse email du prestataire
            subject: 'Nouvelle demande de service reçue',
            html: `
                <h3>Bonjour ${prestataire.nom},</h3>
                <p>Vous avez reçu une nouvelle demande de service :</p>
                <ul>
                    <li><strong>Type de service:</strong> ${typeService}</li>
                    <li><strong>Numéro de téléphone:</strong> ${numeroTelephone}</li>
                    <li><strong>Description:</strong> ${description}</li>

                    <li><strong>Adresse:</strong> ${adresse}</li>
                    <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</li>
                </ul>
                <p>Veuillez vous connecter à votre compte pour consulter les détails et répondre à cette demande.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email :', error.message);
            } else {
                console.log('Email envoyé :', info.response);
            }
        });

        res.status(201).json({
            message: 'Demande de service créée et envoyée avec succès.',
            demande: nouvelleDemande,
        });
    } catch (error) {
        console.error('Erreur lors de la création de la demande de service :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

const obtenirDemandesUtilisateur = async (req, res) => {
    try {
        const demandes = await DemandeService.find();

        // Récupérer les informations du client et du prestataire pour chaque demande
        const demandesAvecInfo = await Promise.all(demandes.map(async (demande) => {
            const client = await Client.findById(demande.demandeur);
            const demandeurs = await Prestataire.findById(demande.demandeur)
            const prestataire = await Prestataire.findById(demande.prestataire);

            return {
                ...demande.toObject(),  // Convertir mongoose document en objet pur
                demandeur: client ? {
                    nom: client.nom,
                    email: client.email,
                    id: client._id // Ajouter l'ID du client
                } : demandeurs ? {
                    nom: demandeurs.nom,
                    email: demandeurs.email,
                    id: demandeurs._id
                } : null,
                prestataire: prestataire ? {
                    nom: prestataire.nom,
                    email: prestataire.email,
                    id: prestataire._id // Ajouter l'ID du prestataire
                } : null,
            };
        }));

        res.status(200).json({ demandes: demandesAvecInfo });
    } catch (error) {
        console.error('Erreur récupération demandes :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Accepter une demande de service**
const accepterDemande = async (req, res) => {
    try {
        const { id } = req.params; // ID de la demande

        // Met à jour la demande de service pour la marquer comme acceptée
        const demande = await DemandeService.findByIdAndUpdate(
            id,
            { statut: 'accepte' },
            { new: true }
        ).populate('client prestataire', 'nom email');

        if (!demande) {
            return res.status(404).json({ message: 'Demande de service non trouvée.' });
        }

        // Envoi d'un email de notification au client et au prestataire
        const client = await Client.findById(demande.demandeur);
        const prestataire = await Prestataire.findById(demande.prestataire);

        const mailOptionsClient = {
            from: process.env.EMAIL_USER,
            to: client.email,
            subject: 'Votre demande a été acceptée',
            html: `
                <h3>Bonjour ${client.nom},</h3>
                <p>Votre demande de service a été acceptée par le prestataire ${prestataire.nom}.</p>
            `,
        };

        const mailOptionsPrestataire = {
            from: process.env.EMAIL_USER,
            to: prestataire.email,
            subject: `Demande acceptée par le client ${client.nom}`,
            html: `
                <h3>Bonjour ${prestataire.nom},</h3>
                <p>La demande de service de ${client.nom} a été acceptée.</p>
            `,
        };

        transporter.sendMail(mailOptionsClient, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email au client :', error.message);
            } else {
                console.log('Email envoyé au client :', info.response);
            }
        });

        transporter.sendMail(mailOptionsPrestataire, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email au prestataire :', error.message);
            } else {
                console.log('Email envoyé au prestataire :', info.response);
            }
        });

        res.status(200).json({
            message: 'Demande acceptée avec succès.',
            demande,
        });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Refuser une demande de service**
const refuserDemande = async (req, res) => {
    try {
        const { id } = req.params; // ID de la demande

        // Met à jour la demande de service pour la marquer comme refusée
        const demande = await DemandeService.findByIdAndUpdate(
            id,
            { statut: 'refuse' },
            { new: true }
        ).populate('client prestataire', 'nom email');

        if (!demande) {
            return res.status(404).json({ message: 'Demande de service non trouvée.' });
        }

        // Envoi d'un email de notification au client et au prestataire
        const client = await Client.findById(demande.demandeur);
        const prestataire = await Prestataire.findById(demande.prestataire);

        const mailOptionsClient = {
            from: process.env.EMAIL_USER,
            to: client.email,
            subject: 'Votre demande a été refusée',
            html: `
                <h3>Bonjour ${client.nom},</h3>
                <p>Votre demande de service a été refusée par le prestataire ${prestataire.nom}.</p>
            `,
        };

        const mailOptionsPrestataire = {
            from: process.env.EMAIL_USER,
            to: prestataire.email,
            subject: `Demande refusée par le client ${client.nom}`,
            html: `
                <h3>Bonjour ${prestataire.nom},</h3>
                <p>La demande de service de ${client.nom} a été refusée.</p>
            `,
        };

        transporter.sendMail(mailOptionsClient, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email au client :', error.message);
            } else {
                console.log('Email envoyé au client :', info.response);
            }
        });

        transporter.sendMail(mailOptionsPrestataire, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email au prestataire :', error.message);
            } else {
                console.log('Email envoyé au prestataire :', info.response);
            }
        });

        res.status(200).json({
            message: 'Demande refusée avec succès.',
            demande,
        });
    } catch (error) {
        console.error('Erreur lors du refus de la demande :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};


/// **Obtenir les demandes d'un client connecté**
const obtenirDemandesParClient = async (req, res) => {
    try {
        const clientId = req.utilisateur._id; // ID extrait du token JWT

        // Récupère toutes les demandes du client
        const demandes = await DemandeService.find({ client: clientId }).populate('prestataire', 'nom email');

        res.status(200).json({
            message: 'Demandes récupérées avec succès.',
            demandes,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes de service pour le client :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Obtenir les demandes d'un prestataire connecté**
const obtenirDemandesParPrestataire = async (req, res) => {
    try {
        const prestataireId = req.utilisateur._id; // ID extrait du token JWT

        // Vérifie si l'utilisateur est bien un prestataire
        if (req.utilisateur.role !== 'prestataire') {
            return res.status(403).json({ message: "Accès interdit. Vous n'êtes pas un prestataire." });
        }

        // Recherche des demandes de service associées au prestataire
        const demandes = await DemandeService.find({ prestataire: prestataireId }).populate('client', 'nom email');

        res.status(200).json({
            message: 'Demandes récupérées avec succès.',
            demandes,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes de service pour le prestataire :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/// **Mettre à jour le statut d'une demande (acceptée, refusée ou terminée)**
const mettreAJourStatutDemande = async (req, res) => {
    try {
        const { id } = req.params; // ID de la demande
        const { statut } = req.body;

        // Vérifie si le statut est valide
        const statutsValides = ['acceptée', 'refusée', 'terminée'];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ message: 'Statut invalide.' });
        }

        // Met à jour la demande de service
        const demande = await DemandeService.findByIdAndUpdate(
            id,
            { statut },
            { new: true }
        ).populate('client prestataire', 'nom email');

        if (!demande) {
            return res.status(404).json({ message: 'Demande de service non trouvée.' });
        }

        res.status(200).json({
            message: 'Statut de la demande mis à jour avec succès.',
            demande,
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la demande :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

module.exports = {
    creerDemandeService,
    obtenirDemandesParClient,
    obtenirDemandesParPrestataire,
    mettreAJourStatutDemande,
    obtenirDemandesUtilisateur,
    accepterDemande,
    refuserDemande,
};
// backendTache21/config/emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilise le service de ton choix (ex: Gmail, Outlook)
    auth: {
        user: process.env.EMAIL_USER, // Ton adresse email
        pass: process.env.EMAIL_PASSWORD, // Ton mot de passe ou app password
    },
});

module.exports = transporter;

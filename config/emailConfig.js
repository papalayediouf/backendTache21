// backendTache21/config/emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilise le service de ton choix (ex: Gmail, Outlook)
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
    },
});

module.exports = transporter;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mot_de_passe: { type: String, required: true },
    role: { type: String, default: 'client', enum: ['client', 'prestataire', 'admin'] }, 
    localisation: { type: String },
    paiementEffectue: { type: Boolean, default: false },
    services: [
        {
            titre: { type: String },
            description: { type: String },
            prix: { type: Number }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

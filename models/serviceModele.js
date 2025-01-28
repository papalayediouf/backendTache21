const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    nomDeservice: { type: String, required: true },
    categorie: { type: String, required: true },
    descriptionDeService: { type: String, required: true },
    imageService: { type: String, default: ''  },
    imageDiplomes: { type: String, default: '' }, //
    prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestataire',  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

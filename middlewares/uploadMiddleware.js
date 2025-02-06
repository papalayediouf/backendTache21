// backendTache21/middlewares/uploadMiddleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Dossier dans Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formats autorisés
  },
});

const upload = multer({ storage });

module.exports = upload;

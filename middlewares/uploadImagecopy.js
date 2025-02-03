const multer = require("multer");
const path = require("path");

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/images");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// Configuration de Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images au format JPEG, JPG, ou PNG sont autorisées."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// Exportation de deux middlewares distincts
module.exports = {
 
  uploadDiplomeImage: upload.single("imageDiplomes"),
};

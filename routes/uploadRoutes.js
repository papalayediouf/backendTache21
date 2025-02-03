const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucune image fournie' });
  }
  res.json({ imageUrl: req.file.path });
});

module.exports = router;

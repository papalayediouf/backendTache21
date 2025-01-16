const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const utilisateur = await User.findById(decoded.id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        req.user = utilisateur;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré", error });
    }
};

module.exports = authMiddleware;

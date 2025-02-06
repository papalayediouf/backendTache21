const jwt = require("jsonwebtoken");
const Prestataire = require("../models/prestataireModele"); // Import du modèle Prestataire

const verifierToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        console.log("Aucun token fourni dans les en-têtes.");
        return res.status(401).json({ message: "Accès non autorisé : token manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Utilisateur décodé :", decoded);

        // Vérifier si l'utilisateur est un prestataire et s'il est bloqué
        if (decoded.role === "prestataire") {
            const prestataire = await Prestataire.findById(decoded.id);
            if (!prestataire) {
                return res.status(404).json({ message: "Prestataire non trouvé." });
            }
            if (!prestataire.actif) {
                return res.status(403).json({ message: "Votre compte est bloqué. Contactez l'administrateur." });
            }
        }

        // Ajout des informations de l'utilisateur dans req.utilisateur
        req.utilisateur = decoded;
        next();
    } catch (err) {
        console.error("Erreur lors de la vérification du token :", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expiré. Veuillez vous reconnecter." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invalide." });
        } else {
            return res.status(500).json({ message: "Erreur interne lors de la vérification du token." });
        }
    }
};

module.exports = { verifierToken };

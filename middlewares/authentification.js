const jwt = require("jsonwebtoken");

const verifierToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.log("Aucun token fourni dans les en-têtes.");
        return res.status(401).json({ message: "Accès non autorisé : token manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Utilisateur décodé :", decoded);

        // Ajout des informations de l'utilisateur dans req.utilisateur
        req.utilisateur = decoded;
        next();
    } catch (err) {
        console.error("Erreur lors de la vérification du token :", err.message);

        // Gestion des différents types d'erreurs JWT
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

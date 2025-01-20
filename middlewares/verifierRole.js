const verifierRole = (rolesAutorises) => {
    return (req, res, next) => {
        try {
            if (!req.utilisateur) {
                return res.status(401).json({ message: "Utilisateur non authentifié." });
            }

            // Normalisation des rôles en minuscules
            const roleUtilisateur = req.utilisateur.role.toLowerCase();
            const rolesNormaux = rolesAutorises.map(role => role.toLowerCase());

            if (!rolesNormaux.includes(roleUtilisateur)) {
                return res.status(403).json({ message: `Accès refusé : rôle '${roleUtilisateur}' non autorisé.` });
            }

            next();
        } catch (err) {
            console.error("Erreur dans le middleware de vérification des rôles :", err.message);
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    };
};

module.exports = verifierRole;
//
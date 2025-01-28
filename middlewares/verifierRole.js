
//backendTache21/middlewares/verifierRole.js

const verifierRole = (rolesAutorises) => {
    if (!Array.isArray(rolesAutorises) || rolesAutorises.length === 0) {
        throw new Error("Le middleware 'verifierRole' nécessite un tableau non vide de rôles autorisés.");
    }

    return (req, res, next) => {
        try {
            if (!req.utilisateur) {
                return res.status(401).json({ message: "Utilisateur non authentifié." });
            }

            const roleUtilisateur = req.utilisateur.role.toLowerCase();
            const rolesNormaux = rolesAutorises.map(role => role.toLowerCase());

            if (!rolesNormaux.includes(roleUtilisateur)) {
                console.warn(
                    `Accès refusé : rôle '${roleUtilisateur}' non autorisé. Rôles autorisés : ${rolesNormaux.join(', ')}.`
                );
                return res.status(403).json({
                    message: `Accès refusé. Votre rôle actuel est '${roleUtilisateur}', mais les rôles requis sont : ${rolesNormaux.join(', ')}.`
                });
            }

            next();
        } catch (err) {
            console.error("Erreur dans le middleware de vérification des rôles :", err.message);
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    };
};

module.exports = verifierRole;

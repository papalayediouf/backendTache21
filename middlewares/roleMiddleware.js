const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé : vous n'avez pas les permissions nécessaires" });
        }
        next();
    };
};

module.exports = roleMiddleware;

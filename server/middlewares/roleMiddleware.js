/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {string[]} allowedRoles - Un tableau des rôles autorisés
 * @returns {function} Middleware function
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Vérifier si l'utilisateur existe et a un rôle
        if (!req.user || !req.user.role) {
            return res.status(403).json({ 
                success: false, 
                message: "Accès non autorisé. Utilisateur non authentifié ou rôle non défini." 
            });
        }

        // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Accès non autorisé. Vous n'avez pas les permissions nécessaires." 
            });
        }

        // Si tout est OK, passer au middleware suivant
        next();
    };
};

module.exports = roleMiddleware;
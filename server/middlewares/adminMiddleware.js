/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 * @param {Object} req - L'objet de requête Express
 * @param {Object} res - L'objet de réponse Express
 * @param {Function} next - La fonction next d'Express
 */
const adminMiddleware = (req, res, next) => {
    // Vérifier si l'utilisateur existe et est authentifié
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentification requise. Veuillez vous connecter."
        });
    }

    // Vérifier si l'utilisateur a le rôle d'administrateur
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Accès refusé. Vous devez être administrateur pour accéder à cette ressource."
        });
    }

    // Si l'utilisateur est un administrateur, passer au middleware suivant
    next();
};

module.exports = adminMiddleware;
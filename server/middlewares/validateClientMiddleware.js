const validateClientMiddleware = (req, res, next) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Fonction pour valider le format de l'email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction pour valider le format du numéro de téléphone
    const isValidPhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phoneNumber);
    };

    // Vérification des champs obligatoires
    if (!firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs (prénom, nom, email et numéro de téléphone) sont obligatoires."
        });
    }

    // Validation du format de l'email
    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Le format de l'adresse email est invalide."
        });
    }

    // Validation du format du numéro de téléphone
    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({
            success: false,
            message: "Le format du numéro de téléphone est invalide."
        });
    }

    // Validation de la longueur des champs
    if (firstName.length < 2 || firstName.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Le prénom doit contenir entre 2 et 50 caractères."
        });
    }

    if (lastName.length < 2 || lastName.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Le nom doit contenir entre 2 et 50 caractères."
        });
    }

    // Si toutes les validations sont passées, on passe au middleware suivant
    next();
};

module.exports = validateClientMiddleware;
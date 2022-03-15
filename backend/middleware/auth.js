//----------- Configuration de l'authentification ------------// 

// Import jsonwebtoken
const jwt = require('jsonwebtoken');
//Import fichier de config
const config = require('../config.js');

// Export d'un middleware standardisé à appliquer aux routes
module.exports = (req, res, next) => {
    // Utilisation de try/catch car plusieurs éléments peuvent être problématiques, on utilise donc ceci pour gérer les erreurs
    try {
        // Récupération du token dans le header authorization
        //Grace à split ça retourne un tableau avec 'Bearer' en 1er élément et le token en 2eme élément
        // Récupération seulement du 2ème element de ce tableau : le token
        const token = req.headers.authorization.split(' ')[1];
        // Décodage du token avec fonction verify de JWT, le token payload et la clé en argument en argument
        // Enregistrement du token décodé dans la variable "req" pour pouvoir retrouver les données de manière globale et dans les controllers
        req.token = jwt.verify(token, `${config.JWT_TOKEN}`);
        // s'il y a un userId dans le corps de la requete et qu'il est différent du userId du token
        if (req.body.userId && req.body.userId !== req.token.userId) {
            // Non authentification de la requête, on retourne une erreur dans le catch 
            throw 'UserID non valable !';
        } else {
            // s'il y a match, commande next pour le prochain middleware
            next();
        }
    } catch {
        // Si exception : on renvoi erreur 401 pour problème d'authentification
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};
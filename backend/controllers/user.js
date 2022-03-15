//----------------------- Fichier controleur user -----------------------// 

// import de bcrypt
const bcrypt = require('bcrypt');
// import jsonwebtoken
const jwt = require('jsonwebtoken');
// import du modèle utilisateur
const User = require('../models/User');
// import fichier config
const config = require('../config.js');


// infrastructure pour les routes d'authentification
// fonction signup pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // fonction asynchrone de cryptage du mot de passe avec le mot de passe du corps de la requête passée par le front-end et le nombre d'éxécution en argument
    bcrypt.hash(req.body.password, 10)
    // Récupération hash, 
        .then(hash => {
            // Enregistrement du hash dans un nouveau user avec le mail de la requete
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistrement de l'utilisateur dans la base de donnée
            user.save()
                // Message de réussite renvoyé en json, code 201 : requête réussie + création de source
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                // Ou message en cas d'erreur, code 400 mauvaise requete du client
                .catch(error => res.status(400).json({ error }));
        })
        // Ou Message erreur code 500 : erreur serveurS
        .catch(error => res.status(500).json({ error }));
};

// Fonction login pour connecter les utilisateurs existants
exports.login = (req, res, next) => {
    // Récupération de l'utilisateur dans la base de donnée qui correspond à l'email renseigné
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé, renvoi code 401 pour ne pas autoriser l'accès
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison des hash, le mot de passe envoyé avec la requete et le hash enregistré dans la bdd
            bcrypt.compare(req.body.password, user.password)
            // Réception d'un booléen pour savoir si valable ou non
            .then(valid => {
                //Si false, c'est invalide : code 401 Non autorisé
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                // Si true, renvoi code 200 = Connexion autorisée et renvoi de l'userId et d'un token au front

                let token_gen = jwt.sign(
                    // ID de l'utilisateur en tant que données à encoder dans le token, pour que la requete corresponde bien à l'userId
                    { userId: user._id },
                    // clé secrete JWT pour l'encodage
                    `${config.JWT_TOKEN}`,
                    // Expiration du token, l'utilisateur devra se reconnecter au bout de 24 h
                    { expiresIn: '24h' 
                })

                res.status(200).json({
                    userId: user._id,
                    // Appel de la fonction sign de JWT pour encoder un nouveau token
                    token: token_gen
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
//----------------------- Fichier Route likes/dislikes -----------------------// 

// Import du modèle de sauce
const Sauce = require('../models/Sauce');

// Gestion likes
exports.likeStatus = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    // Récupération de la sauce selectionnée
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Vérification si l'user a déjà like pour éviter de liker plusieurs fois 
            // (= L'id est dans le tableau usersLiked)
            let userLike = sauce.usersLiked.find(id => id === userId);
            // Vérification si l'user a déjà dislike
            let userDislike = sauce.usersDisliked.find(id => id === userId);

            switch (like) {
                // si like = 1, l'utilisateur like
                case 1:
                    // Si l'utilisateur n'a pas encore like on ajoute un like et l'userId dans le tableau correspondant
                    if (!userLike) {
                        sauce.likes += 1;
                        sauce.usersLiked.push(userId);
                    } else {
                        // si l'utilisateur a déjà like, erreur
                        throw new Error('Un seul like possible!');
                    }
                    // si l'utilisateur avait déjà fait un dislike, envoi d'un message d'erreur
                    if (userDislike) {
                        throw new Error('Annulez votre dislike avant de liker!');
                    }
                    break;

                // si like = 0, l'utilisateur annule son like
                case 0:
                    // Si l'utilisateur a déjà like, on retire le like et le userId du tableau (mais on garde ceux qui ont un id différent)
                    if (userLike) {
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
                    }
                    // si l'utilisateur a déjà dislike, on retire le dislike et le userId du tableau
                    else {
                        //let userDisliked = sauce.usersDisliked.find(id => id === userId);
                        if (userDislike) {
                            sauce.dislikes -= 1;
                            sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
                        }
                    }
                    break;

                // si like = -1, l'utilisateur n'aime pas
                case -1:
                    // si l'user n'a pas encore dislike, On ajoute 1 dislike et l'userId dans le tableau correspondant
                    if (!userDislike) {
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(userId);
                    }
                    else {
                        // si l'utilisateur a déjà dislike, erreur
                        throw new Error('Un seul dislike possible!');
                    }
                    // si l'utilisateur avait déjà fait un like, envoi message d'erreur
                    if (userLike) {
                        throw new Error('Annulez votre like avant de disliker!');
                    }
            }

            // Sauvegarde de la sauce avec le nombre de likes/dislikes modifiés
            sauce.save()
                .then(() => res.status(201).json({ message: 'Préférences enregistrées !' }))
                .catch(error => res.status(400).json({ error }));

        })
        .catch(error => res.status(500).json({ error: error.message }));
};
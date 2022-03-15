//----------------------- Fichier controleur sauces -----------------------// 

// Import du modele sauce
const Sauce = require('../models/Sauce');
// Import du système de fichiers pour avoir accès aux differentes opérations liées au systeme de fichiers (ex: supprimer un fichier)
const fs = require('fs');


// Création d'une sauce
exports.createSauce = (req, res, next) => {
    // Parse des informations de la requête (chaine JSON) en objet JS pour traiter les infos
    const sauceObject = JSON.parse(req.body.sauce);
    // Suppression du champ id de la requete car l'id est celui généré automatiquement par mongoose
    delete sauceObject._id;
    // Nouvelle instance de l'objet Sauce en lui passant un objet JS contenant les infos contenues dans la requête
    const sauce = new Sauce({
        // Utilisation de l'opérateur spread (...) pour faire une copie de tous les élements req.body, il va donc copier les champs qu'il y a dans le corps de la requete et détailler le titre, le description etc...
        ...sauceObject,
        // configuration de l'url de l'image par : "protocole, http/https"://"racineduserveur(localhost:3000)"/images/nomfichier(crée par multer)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // On empêche un utilisateur de créer une sauce avec l'userId d'un autre utilisateur
    // si le userId de la sauce est le même que celui du token de connexion
    if (sauce.userId === req.token.userId) {
        // Enregistrement de la sauce dans la bdd
        sauce.save()
            // Renvoi d'un code 201 pour création réussie
            .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
            // Récupération erreur avec un code 400
            .catch(error => { res.status(400).json({ message: error }) })
    }
    else {
        res.status(401).json({ error: "UserId non valable" });
    }
};

// Modification d'une sauce par son id
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        // La sauce est retournée dans une promise et transmise au front
        .then((sauce) => {
            // Récupération des informations modifiées de la sauce dans la constante sauceObject
            // Utilisation de l'operateur "?" pour savoir si un fichier image a été ajouté à la requête
            const sauceObject = req.file ?
                // Si le fichier image existe, on traite les strings et la nouvelle image
                { // Récupération des strings qui sont dans la requête et on parse en objet 
                    ...JSON.parse(req.body.sauce),
                    // Modification de l'url de l'image
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    // si le fichier image n'existe pas, on traite les autres élements du corps de la requête
                } : { ...req.body };

           // si l'userId de la sauce modifiée est le même que l'userId de la sauce avant modification
           if (sauceObject.userId === sauce.userId) {
                // Mise à jour de la sauce dans la bdd, on compare
                // 1er argument : la sauce choisie, celle dont l'id a été envoyé dans la requête 
                // 2ème argument :  la nouvelle version de la sauce : celle modifiée puis renvoyée dans la requête, en modifiant l'id pour qu'il corresponde à celui des paramètres de la requête
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            // si les userId ne match pas, envoi d'une erreur 401
            else {
                res.status(403).json({ error: "Unauthorized request" });
            }
        })
        // Si aucune sauce n'a été trouvée, envoi d'erreur 401
        .catch(error => res.status(500).json({ error }));
};

// Suppression d'une sauce par son id
exports.deleteSauce = (req, res, next) => {
    // Recherche de la sauce qui a un id qui correspond à celui dans les parametres de la requete
    Sauce.findOne({ _id: req.params.id })
        // Apres avoir trouvé la sauce
        .then(sauce => {
            // On empêche l'utilisateur de supprimer une sauce qu'il n'a pas ajouté
            // Si le userId de la sauce est le même que celui du token de connexion
            if (sauce.userId === req.token.userId) {
                // Extraction du nom du fichier à supprimer
                // Split retourne un tableau de 2 elements : tout ce qui vient avant '/images/' est le 1er élément et tout ce qui vient apres '/images/' est égal au nom du fichier, c'est cette partie qu'on va récupérer
                const filename = sauce.imageUrl.split('/images/')[1];
                // fs.unlink va supprimer l'image du chemin local et dans la bdd
                // 1er argument:  le chemin du fichier, 2eme argument : La marche à suivre une fois le fichier supprimé
                fs.unlink(`images/${filename}`, () => {
                    // Suppression de la sauce de la bdd en indiquant son id
                    // 2e argument inutile car suppression
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à supprimer cette sauce" });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // Obtention de la liste entière grace a la méthode find
    // Retourne une promise
    Sauce.find()
        // Récupération du  tableau de toutes les sauces présentes dans la bdd
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

// Récupération d'une sauce précise par son id 
exports.getOneSauce = (req, res, next) => {
    // L'id de la sauce doit etre le même que le paramètre de requete
    Sauce.findOne({ _id: req.params.id })
        // La sauce est retournée dans une promise et envoyée au front
        .then(sauce => res.status(200).json(sauce))
        // Si aucune sauce trouvée, on renvoie une erreur 404
        .catch(error => res.status(404).json({ error }));
};
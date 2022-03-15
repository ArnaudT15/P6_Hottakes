//----------------------- Fichier configuration pour gerer les fichiers entrants dans les requêtes http -----------------------// 

// Import de multer
const multer = require('multer');

// Dictionnaire pour les extensions de fichiers utilisées dans les noms de fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Création d'un objet de configuration indiquant à multer où et comment enregistrer les fichiers images 
// Enregistrement  sur le disque de stockage de la destination et du nom du fichier
const storage = multer.diskStorage({
    //Précision de  quel dossier on utilise pour enregistrer les fichiers
    destination: (req, file, callback) => {
        // null = il n'y a pas eu d'erreur, en 2eme argument le nom du dossier
        callback(null, 'images');
    },
    // Fonction pour indiquer quel nom de fichier on utilise
    filename: (req, file, callback) => {
        // Génération d'un nouveau nom pour le fichier
        // Retrait des espaces en les remplaçant par des underscores afin d'éviter les erreurs avec split et join
        const name = file.originalname.split(' ').join('_');
        // Ajout d'une extension au fichier : on utilise les élements de notre dictionnaire qui correspondent aux formats de fichiers envoyés par le front
        const extension = MIME_TYPES[file.mimetype];
        // Callback, ou on ajoute le nom + un timestamp(ici un format date sous forme d'entier comptant les milisecondes, nom de fichier unique) + un '.' + l'extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export de multer configuré, 'single' pour dire qu'il s'agit d'un fichier unique + fichier image uniquement
module.exports = multer({ storage }).single('image');
//----------------------- Config des routes pour les sauces -----------------------// 

// Import express
const express = require('express');
// Création du routeur
const router = express.Router();
// Import du controleur sauce
const saucesCtrl = require('../controllers/sauces');
// Import middleware d'authentification
const auth = require('../middleware/auth');
// import middleware multer pour gestion de l'enregistrement des images
const multer = require('../middleware/multer-config');

// Routes avec action CRUD disponibles, les middlewares utilisés et leurs fonctions
// Création d'une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
// Modification d'une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// Suppression d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// Récupération de toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// Récupération d'une sauce selon son id (id automatique de mongoose)
router.get('/:id', auth, saucesCtrl.getOneSauce);



// Export des différentes routes
module.exports = router;
//----------------------- Fichier routes like/dislike -----------------------// 

// Import express
const express = require('express');
// Création du routeur
const router = express.Router();
// Import middleware d'authentification
const auth = require('../middleware/auth');
// Import du controleur user
const likeCtrl = require('../controllers/likes');

// Traitement de l'option like/dislike
router.post('/:id/like', auth, likeCtrl.likeStatus);

// export des routes
module.exports = router; 
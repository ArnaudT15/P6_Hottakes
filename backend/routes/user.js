//----------------------- fichier présentant les routes user disponibles, à quel endpoint et leur fonction -----------------------// 

// import express
const express = require('express');
// creation du routeur
const router = express.Router();

// import du controller user
const userCtrl = require('../controllers/user');

// routes POST car le front-end envoi l'adresse mail et mdp
// (adresse indiquée = le segment final, le reste de l'adresse est déclaré dans appli express)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//on exporte pour pouvoir importer dans app.js
module.exports = router;
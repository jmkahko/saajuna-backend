const express = require('express');
const router = express.Router();
const FavoritesController = require('../controllers/favoritescontroller')
const authorize = require('../verifytoken'); // authorisoinnin vahvistu

// Haetaan käyttäjän suosikit
router.get('/:username', authorize, FavoritesController.haeKayttajanSuosikit);

// Muutetaan käyttäjän suosikkeja
router.put('/:id', authorize, FavoritesController.muutaKayttajanSuosikit);

// Lisätään käyttäjän suosikit
router.post('/', authorize, FavoritesController.lisaaKayttajanSuosikit)

module.exports = router;

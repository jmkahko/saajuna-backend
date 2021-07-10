const express = require('express');
const router = express.Router();
const FavoritesController = require('../controllers/favoritescontroller');
const authorize = require('../verifytoken'); // authorisoinnin vahvistu

// Kaikkien suosikkien haku
router.get('/', authorize, FavoritesController.haeKaikki);

// Haetaan käyttäjän tallentamat suosikit
router.get('/:username', authorize, FavoritesController.haeKayttajanSuosikit);

// Muutetaan käyttäjän tallentamia suosikkeja
router.put('/:id', authorize, FavoritesController.muutaKayttajanSuosikit);

// Lisätään käyttäjän suosikit
router.post('/', authorize, FavoritesController.lisaaKayttajanSuosikit);

// Poista käyttäjän tunnus id:llä
router.delete(
  '/deletefavorite/:id',
  authorize,
  FavoritesController.poistaTunnus
);

module.exports = router;

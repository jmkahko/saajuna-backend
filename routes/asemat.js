const express = require('express');
const router = express.Router();
const AsemaController = require('../controllers/asemacontroller');

const authorize = require('../verifytoken'); // authorisoinnin vahvistu

// Haetaan kaikki asemat
router.get('/', AsemaController.haeKaikki);

// Lisätään asemat. Tämä tehdään GET pyynnöllä, kun dataa ei lähetetä vaan haetaan eri paikasta
router.get('/lisaaasemat', authorize, AsemaController.lisaaAsemat);

// Poista asemat
router.delete('/poistaasemat', authorize,  AsemaController.poistaAsemat);

// Haetaan tietyn aseman id:llä
router.get('/:id', AsemaController.haeIdlla);

// Haetaan tietyn aseman stationShortCodella
router.get('/shortcode/:stationShortCode', AsemaController.haeLyhytKoodilla);

// Haetaan aseman aikataulu
//router.get('/aikataulu/:timestamp/:trainNumber/', AsemaController.asemanAikataulu);

module.exports = router;

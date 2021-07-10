const express = require('express');
const router = express.Router();
const AsemaController = require('../controllers/asemacontroller');

const authorize = require('../verifytoken'); // authorisoinnin vahvistu

// Kaikkien asemien haku
router.get('/', AsemaController.haeKaikki);

// Lisätään asemat. Tämä tehdään GET pyynnöllä, koska dataa ei lähetetä vaan haetaan eri paikasta
router.get('/lisaaasemat', authorize, AsemaController.lisaaAsemat);

// Poistetaan asemat
router.delete('/poistaasemat', authorize, AsemaController.poistaAsemat);

// Haetaan tietty asema sen id:llä
router.get('/:id', AsemaController.haeIdlla);

// Haetaan tietyn aseman stationShortCodella eli aseman lyhytkoodilla
router.get('/shortcode/:stationShortCode', AsemaController.haeLyhytKoodilla);

// Haetaan aseman aikataulu ja ne junat, jotka pysähtyvät asemalla ja milloin ne saapuvat ja lähtevät
router.get(
  '/aikataulu/:station/:arrived_trains/:arriving_trains/:departed_trains/:departing_trains',
  AsemaController.haeAsemanAikataulu
);

module.exports = router;

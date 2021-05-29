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

// Haetaan aseman aikataulu. Junat jotka pysähtyvät asemalla monelta ja monelta lähtevät esim. http://localhost:3000/asemat/aikataulu/KAJ/0/5/0/2
router.get('/aikataulu/:station/:arrived_trains/:arriving_trains/:departed_trains/:departing_trains', AsemaController.haeAsemanAikataulu);

module.exports = router;

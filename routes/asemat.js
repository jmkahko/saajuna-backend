const express = require('express');
const router = express.Router();
const AsemaController = require('../controllers/asemacontroller');

// Haetaan kaikki asemat
router.get('/', AsemaController.haeKaikki);

// Lisätään asemat. Tämä tehdään GET pyynnöllä, kun dataa ei lähetetä vaan haetaan eri paikasta
router.get('/lisaaasemat', AsemaController.lisaaAsemat);

// Poista asemat
router.delete('/poistaasemat', AsemaController.poistaAsemat);

// Haetaan tietyn aseman id:llä
router.get('/:id', AsemaController.haeIdlla);

// Haetaan tietyn aseman stationShortCodella
router.get('/shortcode/:stationShortCode', AsemaController.haeLyhytKoodilla);

module.exports = router;

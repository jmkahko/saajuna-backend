const express = require('express');
const router = express.Router();
const havaintoasemacontroller = require('../controllers/havaintoasemacontroller');

// Haetaan kaikki havaintoasemat
router.get('/', havaintoasemacontroller.haeKaikki);

// Haetaan tietty havaintoasema
router.get('/:fmisid', havaintoasemacontroller.haeAsemaNimella);

// Haetaan tietyn havaintoaseman säätiedot 10 minuuttia
router.get('/saanyt/:fmisid', havaintoasemacontroller.haeHavaintoasemanSaa);

// Haetaan tietyn havaintoaseman sääennuste paikan nimellä
router.get('/saaennuste/:place', havaintoasemacontroller.haeAsemaSaaEnnuste);

module.exports = router;

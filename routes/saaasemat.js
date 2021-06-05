const express = require('express');
const router = express.Router();
const havaintoasemacontroller = require('../controllers/havaintoasemacontroller');

// Haetaan kaikki havaintoasemat
router.get('/', havaintoasemacontroller.haeKaikki);

// Haetaan tietty havaintoasema nimellä
router.get('/nimella/:name', havaintoasemacontroller.haeAsemaNimella);

// Haetaan tietyn havaintoaseman säätiedot 10 minuuttia
router.get('/saanyt/:fmisid', havaintoasemacontroller.haeHavaintoasemanSaa);

module.exports = router;

const express = require('express');
const router = express.Router();
const havaintoasemacontroller = require('../controllers/havaintoasemacontroller');

// Haetaan kaikki havaintoasemat
router.get('/', havaintoasemacontroller.haeKaikki);

// Haetaan tietty havaintoasema
router.get('/nimella/:name', havaintoasemacontroller.haeAsemaNimella);

// Haetaan tietty havaintoasema säätiedot 10 minuuttia
router.get('/saanyt/:fmisid', havaintoasemacontroller.haeHavaintoasemanSaa);

module.exports = router;

const express = require('express');
const router = express.Router();
const JunaController = require('../controllers/junacontroller');

// Haetaan junan viimeinen paikkatieto
router.get('/tietty/:timestamp/:trainNumber/', JunaController.haeJuna);



module.exports = router;



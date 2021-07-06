const express = require('express');
const router = express.Router();
const JunaController = require('../controllers/junacontroller');

// Haetaan junan viimeisin paikkatieto
router.get(
  '/paikkatieto/:timestamp/:trainNumber/',
  JunaController.haePaikkatieto
);

// Haetaan tietyn junan aikataulu
router.get('/aikataulu/:timestamp/:trainNumber/', JunaController.haeAikataulu);

module.exports = router;

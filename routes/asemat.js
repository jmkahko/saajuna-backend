const express = require('express');
const router = express.Router();
const AsemaController = require('../controllers/asemacontroller');

// Haetaan asemat
router.get('/', AsemaController.findAll);

// Päivitä asemat
router.get('/paivita', AsemaController.updateAsemat);

module.exports = router;

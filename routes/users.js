const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usercontroller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Uuden käyttäjän rekisteröinti
router.post('/register', UserController.registerUser);

// Kirjautuminen
router.post('/login', UserController.authenticateUser);

module.exports = router;

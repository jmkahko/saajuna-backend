const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usercontroller');
const authorize = require('../verifytoken'); // authorisoinnin vahvistu

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Uuden käyttäjän rekisteröinti
router.post('/register', UserController.registerUser);

// Kirjautuminen
router.post('/login', UserController.authenticateUser);

// Salasanan vaihto
router.put('/changepassword/:id', authorize, UserController.changeUserPassword);

// Tunnuksen poisto
router.delete('/deleteuser/:id', authorize, UserController.deleteUserAccount);

// Hae käyttäjän id
router.get('/:username', UserController.userId);

module.exports = router;

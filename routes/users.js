const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usercontroller');
const authorize = require('../verifytoken'); // authorisoinnin vahvistus

// Kaikkien käyttäjien haku
router.get('/', authorize, UserController.allUser);

// Uuden käyttäjän rekisteröinti
router.post('/register', UserController.registerUser);

// Kirjautuminen
router.post('/login', UserController.authenticateUser);

// Salasanan vaihto
router.put('/changepassword/:id', authorize, UserController.changeUserPassword);

// Tunnuksen poisto
router.delete('/deleteuser/:id', authorize, UserController.deleteUserAccount);

module.exports = router;

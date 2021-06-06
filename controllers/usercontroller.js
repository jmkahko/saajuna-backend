const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const createToken = require('../createtoken.js');

const UserController = {
  // uuden käyttäjän rekisteröinti
  registerUser: function (req, res, next) {
    // salasana kryptataan ennen tallennusta tietokantaan
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create(
      {
        username: req.body.username,
        password: hashedPassword,
        isadmin: req.body.isadmin,
      },
      (err, user) => {
        if (err) {
          return res.status(500).send('Käyttäjän rekisteröinti epäonnistui.');
        } else {
          const token = createToken(user); // tokenin luontimetodi
          // palautetaan token JSON-muodossa
          res.json({
            success: true,
            message: 'Tässä on valmis Token!',
            token: token,
          });
        }
      }
    );
  },

  // olemassa olevan käyttäjän autentikaatio, jos autentikaatio onnistuu, käyttäjälle luodaan token
  authenticateUser: function (req, res, next) {
    // etsitään käyttäjä kannasta http-pyynnöstä saadun käyttäjätunnuksen perusteella
    User.findOne(
      {
        username: req.body.username,
      },
      function (err, user) {
        if (err) {
          throw err;
        }
        
        if (!user) {
          res.json({
            success: false,
            message: 'Autentikaatio epäonnistui, käyttäjää ei ole.',
          });
        } else if (user) {
          // console.log(req.body.password); // lomakkelle syötetty salasana
          // console.log(user.password); // kannassa oleva salasana
          // verrataan lomakkeelle syötettyä salasanaa kannassa olevaan salasanaan
          // jos vertailtavat eivät ole samat, palautetaan tieto siitä että salasana oli väärä
          if (bcrypt.compareSync(req.body.password, user.password) === false) {
            res.json({
              success: false,
              message: 'Autentikaatio epäonnistui, väärä salasana.',
            });
          } else {
            // jos salasanat ovat samat, luodaan token
            const token = createToken(user); // tokenin luontimetodi
            // palautetaan token JSON-muodossa
            res.json({
              success: true,
              message: 'Tässä on valmis Token!',
              token: token,
            });
          }
        }
      }
    );
  },

  // Käyttäjän salasanan vaihto
  changeUserPassword: function (req, res, next) { 
    // salasana kryptataan ennen tallennusta tietokantaan
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Päivitetään käyttäjän salasana
    User.findByIdAndUpdate(
      {_id: req.params.id},
      {$set: {password: hashedPassword}},
      (error, result) => {
        if (error) {
          throw error;
        }
        res.json('Salasana päivitetty');
      })
  },

  // Käyttäjätunnuksen poisto
  deleteUserAccount: function (req, res, next) { 
    // deleteOne argumentit: {hakukriteeri (req.params.id saa request sanomassa tiedon)} eli _id:tä
    // vastaava id saadaan clientilta, (callback jolla suoritetaan varsinainen haku)
    User.deleteOne({ _id: req.params.id }, (error, result) => {
      // Jos tulee virhe niin lähetetään virhesanoma
      if (error) {
        throw error;
      }
      res.json('Käyttäjä poistettu');
    });
  },

};

module.exports = UserController;
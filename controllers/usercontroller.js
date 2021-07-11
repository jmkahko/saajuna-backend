const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const Favorite = require('../models/Favorites.js');
const createToken = require('../createtoken.js');

const UserController = {
  // Haetaan kaikki käyttäjät
  allUser: (req, res) => {
    User.find((error, kayttajat) => {
      if (error) {
        return res.status(500).send('Kaikkien käyttäjien haku epäonnistui'); // Lähetetään status 500 ja virhe teksti
      }

      res.json(kayttajat);
    });
  },

  // Uuden käyttäjän rekisteröinti
  registerUser: function (req, res, next) {
    // Salasana kryptataan ennen tallennusta tietokantaan.
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create(
      {
        username: req.body.username,
        password: hashedPassword,
        isadmin: req.body.isadmin,
      },
      (err, user) => {
        if (err) {
          console.log(err); // Tulostetaan saatu virhe
          return res.status(500).send('Käyttäjän rekisteröinti epäonnistui.');
        } else {
          const token = createToken(user); // Tokenin luontimetodi
          // Palautetaan token JSON-muodossa.
          res.json({
            success: true,
            message: 'Token luotu!',
            token: token,
          });
        }
      }
    );
  },

  // Kirjaudutaan sisään
  authenticateUser: function (req, res, next) {
    // Etsitään käyttäjä kannasta http-pyynnöstä saadun käyttäjätunnuksen perusteella.
    User.findOne(
      {
        username: req.body.username,
      },
      function (err, user) {
        if (err) {
          console.log(err); // Tulostetaan virhe ilmoitus
          return res.status(500).send('Kirjautuminen epäonnistui'); // Lähetetään status 500 ja virhe teksti
        }

        if (!user) {
          res.json({
            success: false,
            message: 'Autentikaatio epäonnistui, käyttäjää ei ole.',
          });
        } else if (user) {
          // console.log(req.body.password); // lomakkeelle syötetty salasana
          // console.log(user.password); // kannassa oleva salasana
          // Verrataan lomakkeelle syötettyä salasanaa kannassa olevaan salasanaan, ja jos tiedot ovat erit, palautetaan virhe.
          if (bcrypt.compareSync(req.body.password, user.password) === false) {
            res.json({
              success: false,
              message: 'Autentikaatio epäonnistui, väärä salasana.',
            });
          } else {
            // Jos salasanat ovat samat, luodaan token.
            const token = createToken(user); // tokenin luontimetodi
            // Palautetaan token JSON-muodossa.
            res.json({
              success: true,
              message: 'Token luotu!',
              token: token,
            });
          }
        }
      }
    );
  },

  // Käyttäjän salasanan vaihto
  changeUserPassword: function (req, res, next) {
    // Salasana kryptataan ennen tallennusta tietokantaan
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Päivitetään käyttäjän salasana
    User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { password: hashedPassword } },
      (error, result) => {
        if (error) {
          console.log(error) // Tulostetaan virhe
          return res.status(500).send('Salasanan vaihto epäonnistui'); // Lähetetään status 500 ja virhe teksti
        }
        res.json('Salasana on päivitetty');
      }
    );
  },

  // Käyttäjätunnuksen poisto
  deleteUserAccount: function (req, res, next) {
    // deleteOne argumentit: {hakukriteeri (req.params.id saa request sanomassa tiedon)} eli _id:tä
    // Vastaava id saadaan clientilta, (callback jolla suoritetaan varsinainen haku)
    User.deleteOne({ _id: req.params.id }, (error, result) => {
      // Jos tulee virhe, niin lähetetään virhesanoma.
      if (error) {
        console.log(error) // Tulostetaan virhe
        return res.status(500).send('Käyttäjätunnuksen poisto epäonnistui'); // Lähetetään status 500 ja virhe teksti
      }
      res.json('Käyttäjä on poistettu');
    });
  },
};

module.exports = UserController;

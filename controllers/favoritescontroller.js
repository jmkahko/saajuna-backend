// Asema modellin tuonti
const Favorites = require('../models/Favorites');

const FavoritesController = {
  // Haetaan kaikki suosikit.
  haeKaikki: (req, res) => {
    Favorites.find((error, suosikit) => {
      if (error) {
        throw error;
      }

      res.json(suosikit);
    });
  },

  // Hae käyttäjän tallentamat suosikit.
  haeKayttajanSuosikit: (req, res) => {
    Favorites.findOne({ username: req.params.username }, (error, suosikki) => {
      // Jos tulee virhe, niin lähetetään virhesanoma.
      if (error) {
        throw error;
      }
      res.json(suosikki); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin.
    });
  },

  muutaKayttajanSuosikit: (req, res) => {
    // findByIdAndUpdate käyttää aina id:tä päivitykseen.
    // req.body on koko suosikki JSON-muodossa.
    Favorites.findByIdAndUpdate(req.params.id, req.body, (error, result) => {
      // Jos tulee virhe, niin lähetetään virhesanoma.
      if (error) {
        throw error;
      }
      res.json(result);
    });
  },

  // Lisätään käyttäjän suosikit. Käytetään samaa usernamea kuin käyttäjän rekisteröinnissä.
  lisaaKayttajanSuosikit: (req, res) => {
    Favorites.create(
      {
        username: req.body.username,
        favoritesSaa1: req.body.favoritesSaa1,
        favoritesSaa2: req.body.favoritesSaa2,
        favoritesJuna1: req.body.favoritesJuna1,
        favoritesJuna2: req.body.favoritesJuna2,
      },
      // Virheen käsittelyä
      (err) => {
        if (err) {
          return res.status(500).send('Suosikkien lisäykset epäonnistuivat');
        } else {
          // Palautetaan token JSON-muodossa.
          res.json({
            success: true,
          });
        }
      }
    );
  },

  // Poistetaan halutun tunnuksen tiedot
  poistaTunnus: (req, res) => {
    // deleteOne argumentit: {hakukriteeri (req.params.id saa request sanomassa tiedon)} eli _id:tä
    // vastaava id saadaan clientilta, (callback jolla suoritetaan varsinainen haku)
    Favorites.deleteOne({ _id: req.params.id }, (error, result) => {
      // Jos tulee virhe,niin lähetetään virhesanoma.
      if (error) {
        throw error;
      }
      res.json('Käyttäjä on poistettu');
    });
  },
};

module.exports = FavoritesController;

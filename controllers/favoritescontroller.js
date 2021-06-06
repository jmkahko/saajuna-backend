// Asema modellin tuonti
const Favorites = require('../models/Favorites')
const request = require('request');

const FavoritesController = {
  // Hae käyttäjän suosikit
  haeKayttajanSuosikit: (req, res) => {
    Favorites.findOne({ username: req.params.username }, (error, suosikit) => {
      // Jos tulee virhe niin lähetetään virhesanoma
      if (error) {
        throw error;
      }
      res.json(suosikit); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },

  muutaKayttajanSuosikit: (req, res) => {
    // findByIdAndUpdate käyttää aina id:tä päivitykseen
    // req.body on koko suosikki JSON-muodossa
    Favorites.findByIdAndUpdate(req.params.id, req.body, (error, result) => {
      // Jos tulee virhe niin lähetetään virhesanoma
      if (error) {
        throw error;
      }
      res.json(result);
    });
  },

  lisaaKayttajanSuosikit: (req, res) => {
    const NewFavorites = Favorites(req.body);

    NewFavorites.save((error, result) => {
      if (error) {
        throw error;
      }

      res.json(result);
    })
  }

};

module.exports = FavoritesController;

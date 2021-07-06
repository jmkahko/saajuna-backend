const mongoose = require('mongoose');

const FavoritesSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // String muotoinen, pakko olla ja ei voi olla useampaa samaa eli oltava uniikki
  favoritesSaa1: { type: Number }, // Suosikki 1 sääaseman fmisid
  favoritesSaa2: { type: Number }, // Suosikki 2 sääaseman fmisid
  favoritesJuna1: { type: String }, // Suosikki 1 juna-aseman lyhyt nimi
  favoritesJuna2: { type: String }, // Suosikki 2 juna-aseman lyhyt nimi
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka, joka sisältää skeeman.
const Favorites = mongoose.model('favorites', FavoritesSchema); // Eka laitetaan modelin luokka ja mistä se tulee

// Exportataan model, jolloin sitä voidaan heti käyttää mongoose-metodien luontiin
module.exports = Favorites;

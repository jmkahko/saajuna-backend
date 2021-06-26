const mongoose = require('mongoose');

const FavoritesSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // String muotoinen, pakko olla ja ei voi olla useampaa samaa
  favoritesSaa1: { type: Number }, // Suosikki 1 sääasema fmisid
  favoritesSaa2: { type: Number }, // Suosikki 2 sääasema fmisid
  favoritesJuna1: { type: String }, // Suosikki 1 juna-asema asemanlyhyt nimi
  favoritesJuna2: { type: String }, // Suosikki 2 juna-asema asemanlyhyt nimi
})

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman
const Favorites = mongoose.model('favorites', FavoritesSchema); // Eka laitetaan modelin luokka ja mistä tulee

// Exportataan model jolloin sitä voidaan heti käyttää mongoose-metodien luontiin
module.exports = Favorites;
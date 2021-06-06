const mongoose = require('mongoose');

const FavoritesSchema = new mongoose.Schema({
  username_id: { type: String, required: true, unique: true }, // String muotoinen, pakko olla ja ei voi olla useampaa samaa
  favorites1: { type: Number }, // Suosikki sääasema 1
  favorites2: { type: Number }, // Suosikki sääasema 2
  favorites3: { type: Number }, // Suosikki sääasema 3
})

// Tehdään skeemasta model
const Favorites = mongoose.model('favorites', FavoritesSchema);

// Exportataan model jolloin sitä voidaan heti käyttää mongoose-metodien luontiin
module.exports = Favorites;
const mongoose = require('mongoose');

const FavoritesSchema = new mongoose.Schema({
  favoritesSaa: { type: Number }, // Suosikki sääasema fmisid
  favoritesJuna: { type: String }, // Suosikki juna-asema asemanlyhyt nimi
})

// Exportataan model jolloin sitä voidaan heti käyttää mongoose-metodien luontiin
module.exports = FavoritesSchema;
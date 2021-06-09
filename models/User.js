const mongoose = require('mongoose');
const FavoritesSchema = require('./Favorites'); // Tuodaan alidokumentista Suosikki

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // String muotoinen, pakko olla ja ei voi olla useampaa samaa
  password: { type: String, required: true }, // Salasana string muotoinen ja pakko olla
  isadmin: { type: Boolean, required: true }, // Onko admin vai ei tieto
  favorites: { type: [FavoritesSchema], required: false} // Tuodaan suosikit schema ja ei ole pakollinen
})

// Tehdään skeemasta model
const User = mongoose.model('user', UserSchema);

// Exportataan model jolloin sitä voidaan heti käyttää mongoose-metodien luontiin
module.exports = User;
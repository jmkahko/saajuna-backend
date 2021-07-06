const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Käyttäjätunnus on string muotoinen ja se on pakko olla ja niitä ei voi olla useampaa samanlaista.
  password: { type: String, required: true }, // Salasana on myös string muotoinen ja se on pakko olla.
  isadmin: { type: Boolean, required: true }, // Onko käyttäjä admin vai ei.
});

// Tehdään skeemasta model
const User = mongoose.model('user', UserSchema);

// Exportataan model, jolloin sitä voidaan heti käyttää mongoose-metodien luontiin.
module.exports = User;

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // String muotoinen, pakko olla ja ei voi olla useampaa samaa
  password: { type: String, required: true }, // Salasana string muotoinen ja pakko olla
  isadmin: { type: Boolean, required: true }, // Onko admin vai ei tieto
})

// Tehdään skeemasta model
const User = mongoose.model('user', UserSchema);

// Exportataan model jolloin sitä voidaan heti käyttää mongoose-metodien luontiin
module.exports = User;
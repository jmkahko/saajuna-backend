// Mongoose-skema, josta tehdään model joka exportataan.
const mongoose = require('mongoose');

// Havaintoaseman skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon.
const HavaintoasemaSchema = new mongoose.Schema({
  name: { type: String }, // Havaintoaseman nimi
  fmisid: { type: Number }, // FMISID, havaintoaseman yksilöllinen ID
  lpnn: { type: Number }, // LPNN
  wmo: { type: Number }, //  WMO
  latitude: { type: String, max: 9 }, // "64.537118" leveysasteen koordinaatit
  longitude: { type: String, max: 9 }, // "25.006783" pituus asteen koordinaatit
  altitude: { type: Number }, // Korkeus merenpinnasta
  group: { type: String }, // Ryhmä
  start: { type: String }, // Alkaen, milloin kyseinen havaintoasema on otettu käyttöön
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman.
const Havaintoasema = mongoose.model('Havaintoasema', HavaintoasemaSchema); // Eka laitetaan modelin luokka ja mistä tulee.

module.exports = Havaintoasema;

// Mongoose-skema, josta tehdään model joka exportataan
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon
const HavaintoasemaSchema = new mongoose.Schema({
  name: { type: String }, // Havaintoaseman nimi
  fmisid: { type: Number }, // FMISID
  lpnn: { type: Number }, // LPNN
  wmo: { type: Number }, //  WMO
  longitude: { type: String, max: 9 }, // "25.006783"
  latitude: { type: String, max: 9 }, // "64.537118"
  altitude: { type: Number }, // Korkeus
  group: { type: String }, // Ryhmät
  start: { type: String }, // Alkaen
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman
const Havaintoasema = mongoose.model('Havaintoasema', HavaintoasemaSchema); // Eka laitetaan modelin luokka ja mistä tulee

module.exports = Havaintoasema;

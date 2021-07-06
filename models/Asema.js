// Mongoose-skema, josta tehdään model joka exportataan.
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon.
const AsemaSchema = new mongoose.Schema({
  passengerTraffic: { type: Boolean }, // false, true
  type: { type: String, min: 5, max: 25 }, // "STATION", "STOPPING_POINT", "TURNOUT_IN_THE_OPEN_LINE"
  stationName: { type: String, max: 60 }, // "Ahonpää"
  stationShortCode: { type: String, min: 2, max: 5 }, // "AHO"
  stationUICCode: { type: Number }, // 1343
  countryCode: { type: String, min: 2, max: 3 }, // "FI"
  longitude: { type: String, max: 9 }, // "25.006783"
  latitude: { type: String, max: 9 }, // "64.537118"
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka, joka sisältää skeeman.
const Asema = mongoose.model('Asema', AsemaSchema); // Eka laitetaan modelin luokka ja mistä se tulee.

module.exports = Asema;

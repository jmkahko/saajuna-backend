// Mongoose-skema, josta tehdään model joka exportataan
const mongoose = require('mongoose');

// Nykyisen säätilan skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon.
const SaanytSchema = new mongoose.Schema({
  time: { type: String }, // Kellonaika
  t2m: { type: Number }, // Lämpötila
  ws_10min: { type: Number }, // Tuuli
  wg_10min: { type: Number }, //  Tuulen puuska
  wd_10min: { type: Number }, // Tuulen suunta
  rh: { type: Number }, // Kosteus
  td: { type: Number }, // Kastepiste
  r_1h: { type: Number }, // Sademäärä tunnissa
  ri_10min: { type: Number }, // Sateen rankkuus
  snow_aws: { type: Number }, // Lumen syvyys
  p_sea: { type: Number }, // Ilman paine
  vis: { type: Number }, // Näkyvyys
  n_man: { type: Number }, // Pilvisyys
  wawa: { type: Number }, // Säätila
  fmisid: { type: Number }, // esim. Kajaani Petäisenniska 126736
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman.
const Saanyt = mongoose.model('Saanyt', SaanytSchema); // Eka laitetaan modelin luokka ja mistä se tulee

module.exports = Saanyt;

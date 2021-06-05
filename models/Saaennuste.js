// Mongoose-skema, josta tehdään model joka exportataan
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon
// Hirlam piste-ennuste 'simple feature'-muodossa
const SaaennusteSchema = new mongoose.Schema({
  time: { type: String }, // Kellonaika
  geopHeight: { type: Number },
  temperature: { type: Number },
  pressure: { type: Number },
  humidity: { type: Number },
  windDirection: { type: Number },
  windSpeedMS: { type: Number },
  windUMS: { type: Number },
  windVMS: { type: Number },
  maximumWind: { type: Number },
  windGust: { type: Number },
  dewPoint: { type: Number },
  totalCloudCover: { type: Number },
  weatherSymbol3: { type: Number }, // Säätyypin kuvanumero
  lowCloudCover: { type: Number },
  mediumCloudCover: { type: Number },
  highCloudCover: { type: Number },
  precipitation1h: { type: Number },
  precipitationAmount: { type: Number },
  radiationGlobalAccumulation: { type: Number },
  radiationLWAccumulation: { type: Number },
  radiationNetSurfaceLWAccumulation: { type: Number },
  radiationNetSurfaceSWAccumulation: { type: Number },
  radiationDiffuseAccumulation: { type: Number },
  landSeaMask: { type: Number },
  place: { type: String }, // Paikannimi esim. Kajaani
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman
const Saaennuste = mongoose.model('Saaennuste', SaaennusteSchema); // Eka laitetaan modelin luokka ja mistä tulee

module.exports = Saaennuste;

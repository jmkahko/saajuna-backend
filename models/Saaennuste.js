// Mongoose-skema, josta tehdään model joka exportataan
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon
// Hirlam piste-ennuste 'simple feature'-muodossa
const SaaennusteSchema = new mongoose.Schema({
  time: { type: String }, // Kellonaika
  GeopHeight: { type: Number },
  Temperature: { type: Number }, //Lämpötila
  Pressure: { type: Number },
  Humidity: { type: Number },
  WindDirection: { type: Number }, //Tuulen suunta
  WindSpeedMS: { type: Number }, //Tuulen nopeus
  WindUMS: { type: Number },
  WindVMS: { type: Number },
  MaximumWind: { type: Number },
  WindGust: { type: Number },
  DewPoint: { type: Number },
  TotalCloudCover: { type: Number },
  WeatherSymbol3: { type: Number }, // Säätyypin kuvanumero
  LowCloudCover: { type: Number },
  MediumCloudCover: { type: Number },
  HighCloudCover: { type: Number },
  Precipitation1h: { type: Number },
  PrecipitationAmount: { type: Number },
  RadiationGlobalAccumulation: { type: Number },
  RadiationLWAccumulation: { type: Number },
  RadiationNetSurfaceLWAccumulation: { type: Number },
  RadiationNetSurfaceSWAccumulation: { type: Number },
  RadiationDiffuseAccumulation: { type: Number },
  LandSeaMask: { type: Number },
  latlon: { type: String }, // Paikan koordinaatit esim. 64.22,27.75
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman
const Saaennuste = mongoose.model('Saaennuste', SaaennusteSchema); // Eka laitetaan modelin luokka ja mistä se tulee

module.exports = Saaennuste;

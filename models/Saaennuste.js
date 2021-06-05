// Mongoose-skema, josta tehdään model joka exportataan
const mongoose = require('mongoose');

// Skeeman luonti. Skeema määrittää kannassa olevan tiedon muodon
// Hirlam piste-ennuste 'simple feature'-muodossa
const SaaennusteSchema = new mongoose.Schema({
  time: { type: String }, // Kellonaika
  geopheight: { type: Number },
  temperature: { type: Number },
  pressure: { type: Number },
  humidity: { type: Number },
  winddirection: { type: Number },
  windspeedms: { type: Number },
  windums: { type: Number },
  windvms: { type: Number },
  maximumwind: { type: Number },
  windgust: { type: Number },
  dewpoint: { type: Number },
  totalcloudcover: { type: Number },
  weathersymbol3: { type: Number }, // Säätyypin kuvanumero
  lowcloudcover: { type: Number },
  mediumcloudcover: { type: Number },
  highcloudcover: { type: Number },
  precipitation1h: { type: Number },
  precipitationamount: { type: Number },
  radiationglobalaccumulation: { type: Number },
  radiationlwaccumulation: { type: Number },
  radiationnetsurfacelwaccumulation: { type: Number },
  radiationnetsurfaceswaccumulation: { type: Number },
  radiationdiffuseaccumulation: { type: Number },
  landseamask: { type: Number },
  place: { type: String }, // Paikannimi esim. Kajaani
});

// Tehdään skeemasta model, jonka metodeilla kantaoperaatioita suoritetaan. Model on luokka joka sisältää skeeman
const Saaennuste = mongoose.model('Saaennuste', SaaennusteSchema); // Eka laitetaan modelin luokka ja mistä tulee

module.exports = Saaennuste;

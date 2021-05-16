const mongoose = require('mongoose');
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua

mongoose.set('useUnifiedTopology', true); // määritys jota käytetään tietokantapalvelimen etsinnässä

// yhteydenotto omalla koneella sijaitsevaan kantaan jossa ei ole autentikaatiota
// mongoose.connect('mongodb://@localhost:27017/studentdb',{ useNewUrlParser: true });

// yhteydenotto Docker-kontissa sijaitsevaan kantaan, kontin IP on XXX.XX.X.X: Voi myös toimi suoraan localhost komennolla
mongoose
  .connect(
    'mongodb://' +
      process.env.DB_USER +
      ':' +
      process.env.DB_PW +
      '@localhost:27017/' +
      process.env.DB_NAME,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });

const mongoose = require('mongoose');
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua

mongoose.set('useUnifiedTopology', true); // määritys jota käytetään tietokantapalvelimen etsinnässä

// yhteydenotto omalla koneella sijaitsevaan kantaan jossa ei ole autentikaatiota
// mongoose.connect('mongodb://@localhost:27017/studentdb',{ useNewUrlParser: true });

// yhteydenotto Docker-kontissa sijaitsevaan kantaan, kontin IP on XXX.XX.X.X: Voi myös toimi suoraan localhost komennolla
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });

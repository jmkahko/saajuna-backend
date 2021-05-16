const Asema = require('./models/Asema');
require('./dbconnection'); // Tietokantayhteys

const uusiAsema = new Asema({
  passengerTraffic: false,
  type: 'STATION',
  stationName: 'Ahonpää',
  stationShortCode: 'AHO',
  stationUICCode: 1343,
  countryCode: 'FI',
  longitude: 25.006783,
  latitude: 64.537118,
});

uusiAsema
  .save()
  .then((res) => {
    console.log('tallennettu: ' + res);
  })
  .catch((err) => {
    console.log(err);
  });

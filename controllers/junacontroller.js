const request = require('request');

const JunaController = {

  // Yksittäisen junan haku esim. https://rata.digitraffic.fi/api/v1/train-locations/2021-05-23/67
  haePaikkatieto: (req, res) => {

    const paiva = req.params.timestamp; // Saadaan päivätieto
    const juna = req.params.trainNumber; // Saadaan junan numero

    const url = 'https://rata.digitraffic.fi/api/v1/train-locations/' + paiva + '/' + juna;

    // Asetetaan haulle optioita. url sivu mistä haetaan, headers kerrotaan Accect-Encoding tieto, kun ilman sitä dataa ei saada
    const options = {
      url: url, // Laitetaan url tieto
      headers: {
        'accept-encoding': 'gzip', // Kerrotaan headerissa, että hyväksytään gzip encode
      },
      JSON: true, // JSON hyväksytään
      method: 'GET', // Metodi on GET eli haku
      gzip: true, // gzip hyväksytään. Ilman tätä riviä tieto on siansaksaa
    };

    request(options, function (error, response) {
      // Jos tulee palautuksena arvo 200 niin tulostetaan saatu tulos
      if (response.statusCode === 200) {
        // Parseroidaan tulos data muuttujaan
        let data = JSON.parse(response.body);
        res.json(data[0]); // Palautetaan JSONina junan tieto
      } else {
        // Jos tulee muu kuin 200 vastaus viestissä, niin tulostetaan koodi ja virhe viesti
        console.log('Statuskoodi: ' + response.statusCode);
        console.log('Virhe: ' + error);
      }
    });
  },
}

module.exports = JunaController;
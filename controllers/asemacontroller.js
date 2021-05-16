// Asema modellin tuonti
const Asema = require('../models/Asema');
const request = require('request');

const AsemaController = {
  // Haetaan kaikki asemat
  haeKaikki: (req, res) => {
    Asema.find((error, asemat) => {
      if (error) {
        throw error;
      }

      res.json(asemat);
    });
  },

  // Haetaan asema id:llä
  haeIdlla: (req, res) => {
    Asema.findOne({ _id: req.params.id }, (error, asemat) => {
      // Jos tulee virhe niin lähetetään virhesanoma
      if (error) {
        throw error;
      }
      res.json(asemat); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },

  // Haetaan asema lyhytkoodilla stationShortCodella
  haeLyhytKoodilla: (req, res) => {
    Asema.findOne(
      { stationShortCode: req.params.stationShortCode },
      (error, asemat) => {
        // Jos tulee virhe niin lähetetään virhesanoma
        if (error) {
          throw error;
        }
        res.json(asemat); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
      }
    );
  },

  // Talletaan kaikki asemat https://rata.digitraffic.fi/api/v1/metadata/stations linkistä
  lisaaAsemat: (req, res) => {
    // Haetaan rautatie asemat
    const url = 'https://rata.digitraffic.fi/api/v1/metadata/stations';

    let asemia = 0;

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

        for (let i = 0; i < data.length; i++) {
          const UusiAsema = Asema(data[i]); // Otetaan yhden aseman tieto kerrallaan ja tallennetaan

          UusiAsema.save((error, result) => {
            if (error) {
              throw error;
            }
          });
          asemia++; // Lisätään asema muuttujaan yksi joka tallennuksella
        }
        console.log('Lisätty ' + data.length + ' asemaa');
      } else {
        // Jos tulee muu kuin 200 vastaus viestissä, niin tulostetaan koodi ja virhe viesti
        console.log('Statuskoodi: ' + response.statusCode);
        console.log('Virhe: ' + error);
      }

      res.json({ 'Asemia lisätty': asemia }); // Palautetaan JSONina monta asemaa lisätty
    });
  },

  // Poistetaan asemat tietokannasta
  poistaAsemat: (req, res) => {
    Asema.deleteMany({}, (error, result) => {
      // Jos tulee virhe niin lähetetään virhesanoma
      if (error) {
        throw error;
      }
      res.send(result); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },
};

module.exports = AsemaController;

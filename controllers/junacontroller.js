const request = require('request');
const Asema = require('../models/Asema');

const JunaController = {

  // Yksittäisen junan viimeisin paikkatieto. Sanomassa tulee paikka tiedot koko matkalta esim. https://rata.digitraffic.fi/api/v1/train-locations/2021-05-23/67
  haePaikkatieto: (req, res) => {

    const paiva = req.params.timestamp; // Saadaan päivätieto
    const juna = req.params.trainNumber; // Saadaan junan numero

    // Tehdään tarvittava url tiedosto
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

        // Tarkistetaan, että onko junalla paikkatietoja saatavilla
        if (data.length === 0) {
          res.json([])
        } else {
          res.json(data[0]); // Palautetaan JSONina junan viimeisin paikkatieto
        }

      } else {
        // Jos tulee muu kuin 200 vastaus viestissä, niin tulostetaan koodi ja virhe viesti
        console.log('Statuskoodi: ' + response.statusCode);
        console.log('Virhe: ' + error);
        res.status(response.statusCode).send([]); // Lähetetään statuskoodi ja tyhjä taulukko
      }
    });
  },

  // Haetaan junan aikataulu esim. https://rata.digitraffic.fi/api/v1/trains/2021-04-27/67
  haeAikataulu: (req, res) => {

      Asema.find((error, asemat) => {
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin
          res.json(error); // Palautetaan virhe JSON muodossa
        }
  
        const paiva = req.params.timestamp; // Saadaan päivätieto
        const juna = req.params.trainNumber; // Saadaan junan numero
      
        const url = 'https://rata.digitraffic.fi/api/v1/trains/' + paiva + '/' + juna;
      
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

            // Tarkistetaan, että onko aikataulutietoa saatavilla
            if (data.length === 0) {
              res.json([]) // Jos paluusanomassa tulee tyhjä taulukko, niin lähetetään se myös eteenpäin
            } else {
              let junanaikataulu = []; // Luodaan taulukko joohon tallennetaan junan tiedot
              let pysakit = []; // Tallennetaan miten on pysähdytty
      
              // Junan tietoja
              junanaikataulu.push(['trainNumber', data[0]['trainNumber']])
              junanaikataulu.push(['trainType', data[0]['trainType']]); // Junatyyppi IC, Pendoliino ym.
              junanaikataulu.push(['trainCategory', data[0]['trainCategory']]); // juna kategoria
              junanaikataulu.push(['runningCurrently', data[0]['runningCurrently']]); // juna kulussa
  
              // Junan viimeinen asema
              let timeTableRiveja = data[0]['timeTableRows'].length - 1;
  
              // Käydään läpi tiedot, että saadaan asema-taulusta aseman kokonimi
              for (let z = 0; z < asemat.length; z++) {
  
                // Asemalta jolta juna on lähtenyt kokonimi
                if (data[0]['timeTableRows'][0]['stationShortCode'] === asemat[z].stationShortCode) {
                  junanaikataulu.push(['startStationLongName', asemat[z].stationName])
                }
              
                // Junan viimeinen asema kokonimi
                  if (data[0]['timeTableRows'][timeTableRiveja]['stationShortCode'] === asemat[z].stationShortCode) {
                    junanaikataulu.push(['endStationLongName', asemat[z].stationName])
                  }
              }
      
              // Asema jolta juna on lähtenyt
              junanaikataulu.push(['startStationShortCode', data[0]['timeTableRows'][0]['stationShortCode']])
      
              // Junan viimeinen asema
              junanaikataulu.push(['endStationShortCode', data[0]['timeTableRows'][timeTableRiveja]['stationShortCode']])
              
              let aikataulu = []; // Laitetaan taulukkoon saadut pysäkit
              // Jokainen aseman aikataulu
              for (let x = 0; x < data[0]['timeTableRows'].length; x++) {
      
                // Tallennetaan aikataulu tieto
                aikataulu.push(['stationShortCode', data[0]['timeTableRows'][x]['stationShortCode']]);
  
                // Käydään läpi tiedot, että saadaan asema-taulusta aseman kokonimi
                for (let z = 0; z < asemat.length; z++) {
                  // Rautatieaseman kokonimi
                  if (data[0]['timeTableRows'][x]['stationShortCode'] === asemat[z].stationShortCode) {
                    aikataulu.push(['stationLongName', asemat[z].stationName])
                  }
                }
  
                aikataulu.push(['type', data[0]['timeTableRows'][x]['type']]); // Saapuuko vai lähteekö juna
                aikataulu.push(['trainStopping', data[0]['timeTableRows'][x]['trainStopping']]); // Pysähtyykö asemalle
                aikataulu.push(['commercialTrack', data[0]['timeTableRows'][x]['commercialTrack']]); // Raide jolle juna pysähtyy
                aikataulu.push(['scheduledTime', data[0]['timeTableRows'][x]['scheduledTime']]); // Aikataulu          
                aikataulu.push(['actualTime', data[0]['timeTableRows'][x]['actualTime']]); // Todellinen 
                aikataulu.push(['liveEstimateTime', data[0]['timeTableRows'][x]['liveEstimateTime']]); // live seurannasta?
                aikataulu.push(['differenceInMinutes', data[0]['timeTableRows'][x]['differenceInMinutes']]); // aikataulu ero
      
      
                // Tehdään aikataulu taulukosta objeckti ja tallennetaan pysäkit taulukkoon
                let aikatauluToObject = Object.fromEntries(new Map(aikataulu)); 
                pysakit.push(aikatauluToObject);
              }
      
              // Tehdään taulukosta objeckti
              junanaikataulu.push(['timeTableRows', pysakit])
              let arrayToObject = Object.fromEntries(new Map(junanaikataulu));  
      
              // Lähetetään JSON sanomana taulukko eteenpäin taulukkona
              res.json(arrayToObject);
            }
  
          } else {
            // Jos tulee muu kuin 200 vastaus viestissä, niin tulostetaan koodi ja virhe viesti
            console.log('Statuskoodi: ' + response.statusCode);
            console.log('Virhe: ' + error);
            res.status(response.statusCode).send([]); // Lähetetään statuskoodi ja tyhjä taulukko
          }
        });
      });
  },
}

module.exports = JunaController;
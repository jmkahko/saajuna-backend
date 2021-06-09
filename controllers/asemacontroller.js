// Asema modellin tuonti
const Asema = require('../models/Asema');
const request = require('request');
const { startSession } = require('../models/Asema');

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
      res.json({ 'Asemat poistettu': result });  // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },

  // Hae aseman aikataulu esim. https://rata.digitraffic.fi/api/v1/live-trains/station/KAJ?arrived_trains=0&arriving_trains=5&departed_trains=0&departing_trains=2&include_nonstopping=false
  haeAsemanAikataulu: (req, res) => {

    const station = req.params.station; // Asema
    const arrived_trains = req.params.arrived_trains; // Kuinka monta saapunutta junaa palautetaan maksimissaan
    const arriving_trains = req.params.arriving_trains; // Kuinka monta saapuvaa junaa palautetaan maksimissaan
    const departed_trains = req.params.departed_trains; // Kuinka monta lähtenyttä junaa palautetaan maksimissaan
    const departing_trains = req.params.departing_trains; // Kuinka monta lähtevää junaa palautetaan maksimissaan
    // include_nonstopping=false suoraan on poistettu ne jotka ovat vaan läpikulussa, etteivät pysähdy

    const url = 'https://rata.digitraffic.fi/api/v1/live-trains/station/' + station + '?arrived_trains=' + arrived_trains + '&arriving_trains=' + arriving_trains + '&departed_trains=' + departed_trains + '&departing_trains=' + departing_trains + '&include_nonstopping=false'

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

        let asemantiedot = []; // Luodaan taulukko johon tallennetaan tiedot
        let junientiedot = []; // Luodaan taulukko joohon tallennetaan junien tiedot

        // Pyöräytetään ensimmäinen for silmukka kaikki junat jotka haku palauttaa
        for (let i = 0; i < data.length; i++) {
          junientiedot.push(['trainNumber', data[i]['trainNumber']]);
          junientiedot.push(['trainType', data[i]['trainType']]); // Junatyyppi IC, Pendoliino ym.
          junientiedot.push(['trainCategory', data[i]['trainCategory']]); // juna kategoria

          // Asema jolta juna on lähtenyt
          junientiedot.push(['startStation', data[i]['timeTableRows'][0]['stationShortCode']])

          // Junan viimeinen asema
          let timeTableRiveja = data[i]['timeTableRows'].length - 1;
          junientiedot.push(['endStation', data[i]['timeTableRows'][timeTableRiveja]['stationShortCode']])
          
          // Halutun asemantiedot
          junientiedot.push(['stationStop', station]);
          // Jokainen juna erikseen for silmukassa
          for (let x = 0; x < data[i]['timeTableRows'].length; x++) {
            
            // Haluttu asema
            if (data[i]['timeTableRows'][x]['stationShortCode'] === station) {
              // Saapuvan junan aikataulu UTC aika
              if (data[i]['timeTableRows'][x]['type'] === 'ARRIVAL') {
                junientiedot.push(['arrivalScheduledTime', data[i]['timeTableRows'][x]['scheduledTime']]);
                junientiedot.push(['arrivalActualTime', data[i]['timeTableRows'][x]['actualTime']]);
                junientiedot.push(['arrivalLiveEstimateTime', data[i]['timeTableRows'][x]['liveEstimateTime']]);
                junientiedot.push(['arrivalDifferenceInMinutes', data[i]['timeTableRows'][x]['differenceInMinutes']]);
              }

              // Lähtevän junan aikataulu UTC aika
              if (data[i]['timeTableRows'][x]['type'] === 'DEPARTURE') {
                junientiedot.push(['departureScheduledTime', data[i]['timeTableRows'][x]['scheduledTime']]);           
                junientiedot.push(['departureActualTime', data[i]['timeTableRows'][x]['actualTime']]);
                junientiedot.push(['departureLiveEstimateTime', data[i]['timeTableRows'][x]['liveEstimateTime']]);
                junientiedot.push(['departureDifferenceInMinutes', data[i]['timeTableRows'][x]['differenceInMinutes']]);
              }
            }
          }

          // Tehdään taulukosta objeckti
          let arrayToObject = Object.fromEntries(new Map(junientiedot));  

          // Tallennetaan junientiedon taulukko asemantiedot taulukkoon
          asemantiedot.push(arrayToObject);
          junientiedot = []; // Tyhjennetään taulukko
        }

        // Tulostetaan saatu tulos
        console.log(asemantiedot);

        // Lähetetään JSON sanomana taulukko eteenpäin
        res.json(asemantiedot);


      } else {
        // Jos tulee muu kuin 200 vastaus viestissä, niin tulostetaan koodi ja virhe viesti
        console.log('Statuskoodi: ' + response.statusCode);
        console.log('Virhe: ' + error);
      }
    });
  },
};

module.exports = AsemaController;

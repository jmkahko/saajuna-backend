// Asema modellin tuonti
const Asema = require('../models/Asema');
const request = require('request');

const AsemaController = {
  // Haetaan kaikki rautatieasemat.
  haeKaikki: (req, res) => {
    Asema.find((error, asemat) => {
      if (error) {
        console.log(error); // Lähetetään virhe myös konsoliin.
        res.json(error); // Palautetaan virhe JSON muodossa.
      }

      res.json(asemat);
    });
  },

  // Haetaan asema id:llä
  haeIdlla: (req, res) => {
    Asema.findOne({ _id: req.params.id }, (error, asemat) => {
      // Jos tulee virhe, niin lähetetään virhesanoma JSONina, koska muuten backend kaatuu.
      if (error) {
        console.log(error); // Lähetetään virhe myös konsoliin.
        res.json(error); // Palautetaan virhe JSON muodossa.
      }
      res.json(asemat); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin.
    });
  },

  // Haetaan asema lyhytkoodilla eli stationShortCodella.
  haeLyhytKoodilla: (req, res) => {
    Asema.findOne(
      { stationShortCode: req.params.stationShortCode },
      (error, asemat) => {
        // Jos tulee virhe, niin lähetetään virhesanoma.
        if (error) {
          console.log(error); // Lähetetään virhe myös konsoliin.
          res.json(error); // Palautetaan virhe JSON muodossa.
        }
        res.json(asemat); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin.
      }
    );
  },

  // Talletaan kaikki asemat https://rata.digitraffic.fi/api/v1/metadata/stations linkistä.
  lisaaAsemat: (req, res) => {
    // Haetaan rautatieasemat
    const url = 'https://rata.digitraffic.fi/api/v1/metadata/stations';

    let asemia = 0; // Saadaan JSON sanomaan arvo montako asemaa lisättiin.

    // Asetetaan haulle optioita; url sivu mistä haetaan, headers kerrotaan Accect-Encoding tieto, kun ilman sitä dataa ei saada.
    const options = {
      url: url, // Laitetaan url tieto
      headers: {
        'accept-encoding': 'gzip', // Kerrotaan headerissa, että hyväksytään gzip encode.
      },
      JSON: true, // JSON hyväksytään
      method: 'GET', // Metodi on GET eli haku
      gzip: true, // gzip hyväksytään. Ilman tätä riviä tieto on siansaksaa.
    };

    request(options, function (error, response) {
      // Jos palautuu arvo 200, niin dataa saadaan, muuten tulee virhe.
      if (response.statusCode === 200) {
        // Parseroidaan tulos data muuttujaan.
        let data = JSON.parse(response.body);

        // Lisätään jokainen rautatieasema yksitellen tietokantaan.
        for (let i = 0; i < data.length; i++) {
          const UusiAsema = Asema(data[i]); // Otetaan yhden aseman tieto kerrallaan ja tallennetaan.

          // Tallennetaan rautatieasema
          UusiAsema.save((error, result) => {
            if (error) {
              console.log(error); // Lähetetään virhe myös konsoliin.
              res.json(error); // Palautetaan virhe JSON muodossa.
            }
          });
          asemia++; // Lisätään asema-muuttujaan yksi jokaisella tallennuksella.
        }
        console.log('Lisätty ' + data.length + ' asemaa');
      } else {
        // Jos tulee muu kuin 200 vastaus viestissä, niin tulostetaan koodi ja virheilmoitus.
        console.log('Statuskoodi: ' + response.statusCode);
        console.log('Virhe: ' + error);
      }

      res.json({ 'Asemia lisätty': asemia }); // Palautetaan JSONina montako asemaa lisätty.
    });
  },

  // Poistetaan kaikki rautatieasemat tietokannasta.
  poistaAsemat: (req, res) => {
    Asema.deleteMany({}, (error, result) => {
      // Jos tulee virhe, niin lähetetään virhesanoma.
      if (error) {
        console.log(error); // Lähetetään virhe myös konsoliin.
        res.json(error); // Palautetaan virhe JSON muodossa.
      }
      res.json({ 'Kaikki asemat poistettu': result }); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin.
    });
  },

  // Hae rautatieaseman aikataulu esim. https://rata.digitraffic.fi/api/v1/live-trains/station/KAJ?arrived_trains=0&arriving_trains=5&departed_trains=0&departing_trains=2&include_nonstopping=false
  haeAsemanAikataulu: (req, res) => {
    // Haetaan aluksi tietokannasta kaikki rautatieasemat.
    Asema.find((error, asemat) => {
      // Jos tulee virhe, niin lähetetään virhesanoma.
      if (error) {
        console.log(error); // Lähetetään virhe myös konsoliin.
        res.json(error); // Palautetaan virhe JSON muodossa.
      }

      const station = req.params.station; // Rautatieaseman lyhytkoodi
      const arrived_trains = req.params.arrived_trains; // Kuinka monta saapunutta junaa palautetaan maksimissaan
      const arriving_trains = req.params.arriving_trains; // Kuinka monta saapuvaa junaa palautetaan maksimissaan
      const departed_trains = req.params.departed_trains; // Kuinka monta lähtenyttä junaa palautetaan maksimissaan
      const departing_trains = req.params.departing_trains; // Kuinka monta lähtevää junaa palautetaan maksimissaan
      // include_nonstopping=false suoraan on poistettu ne jotka ovat vaan läpikulussa, etteivät pysähdy

      const url =
        'https://rata.digitraffic.fi/api/v1/live-trains/station/' +
        encodeURIComponent(station) + // encodeURIComponent:in avulla saadaan ääkköset toimimaan. Muuten palautus on status 400.
        '?arrived_trains=' +
        arrived_trains +
        '&arriving_trains=' +
        arriving_trains +
        '&departed_trains=' +
        departed_trains +
        '&departing_trains=' +
        departing_trains +
        '&include_nonstopping=false';

      // Asetetaan haulle optioita; url sivu mistä haetaan, headers kerrotaan Accect-Encoding tieto, koska ilman sitä dataa ei saada.
      const options = {
        url: url, // Laitetaan url tieto.
        headers: {
          'accept-encoding': 'gzip', // Kerrotaan headerissa, että hyväksytään gzip encode.
          'Content-Type': 'application/json;charset=UTF-8',
        },
        JSON: true, // JSON hyväksytään.
        method: 'GET', // Metodi on GET eli haku.
        gzip: true, // gzip hyväksytään. Ilman tätä riviä tieto on siansaksaa.
      };

      console.log(options);

      request(options, function (error, response) {
        // Jos tulee palautuksena arvo 200, niin tulostetaan saatu tulos.
        if (response.statusCode === 200) {
          // Parseroidaan tulos data muuttujaan.
          let data = JSON.parse(response.body);

          let asemantiedot = []; // Luodaan taulukko, johon tallennetaan tiedot.
          let junientiedot = []; // Luodaan taulukko, johon tallennetaan junien tiedot.

          // Pyöräytetään ensimmäinen for-silmukka kaikki junat jotka haku palauttaa.
          for (let i = 0; i < data.length; i++) {
            junientiedot.push(['trainNumber', data[i]['trainNumber']]); // Junan numero
            junientiedot.push(['trainType', data[i]['trainType']]); // Junatyyppi IC, Pendolino ym.
            junientiedot.push(['trainCategory', data[i]['trainCategory']]); // Junan kategoria

            // Asema, jolta juna on lähtenyt.
            junientiedot.push([
              'startStation',
              data[i]['timeTableRows'][0]['stationShortCode'],
            ]);

            // Junan viimeinen asema.
            let timeTableRiveja = data[i]['timeTableRows'].length - 1;

            // Käydään läpi tiedot, että saadaan asema-taulusta aseman koko nimi
            for (let z = 0; z < asemat.length; z++) {
              // Rautatieasema, jolta juna on lähtenyt ja sen koko nimi
              if (
                data[i]['timeTableRows'][0]['stationShortCode'] ===
                asemat[z].stationShortCode
              ) {
                junientiedot.push([
                  'startStationLongName',
                  asemat[z].stationName,
                ]);
              }

              // Junan viimeinen rautatieasema ja sen koko nimi
              if (
                data[i]['timeTableRows'][timeTableRiveja][
                  'stationShortCode'
                ] === asemat[z].stationShortCode
              ) {
                junientiedot.push([
                  'endStationLongName',
                  asemat[z].stationName,
                ]);
              }
            }

            // Junan viimeinen asema
            junientiedot.push([
              'endStation',
              data[i]['timeTableRows'][timeTableRiveja]['stationShortCode'],
            ]);

            // Halutun rautatieaseman lyhytkoodi
            junientiedot.push(['stationStop', station]);

            // Käsitellään jokainen juna erikseen for-silmukassa.
            for (let x = 0; x < data[i]['timeTableRows'].length; x++) {
              // Haluttu rautatieasema
              if (data[i]['timeTableRows'][x]['stationShortCode'] === station) {
                // Saapuvan junan aikataulu UTC-ajassa
                if (data[i]['timeTableRows'][x]['type'] === 'ARRIVAL') {
                  junientiedot.push([
                    'arrivalScheduledTime',
                    data[i]['timeTableRows'][x]['scheduledTime'],
                  ]);
                  junientiedot.push([
                    'arrivalActualTime',
                    data[i]['timeTableRows'][x]['actualTime'],
                  ]);
                  junientiedot.push([
                    'arrivalLiveEstimateTime',
                    data[i]['timeTableRows'][x]['liveEstimateTime'],
                  ]);
                  junientiedot.push([
                    'arrivalDifferenceInMinutes',
                    data[i]['timeTableRows'][x]['differenceInMinutes'],
                  ]);
                }

                // Lähtevän junan aikataulu UTC-ajassa.
                if (data[i]['timeTableRows'][x]['type'] === 'DEPARTURE') {
                  junientiedot.push([
                    'departureScheduledTime',
                    data[i]['timeTableRows'][x]['scheduledTime'],
                  ]);
                  junientiedot.push([
                    'departureActualTime',
                    data[i]['timeTableRows'][x]['actualTime'],
                  ]);
                  junientiedot.push([
                    'departureLiveEstimateTime',
                    data[i]['timeTableRows'][x]['liveEstimateTime'],
                  ]);
                  junientiedot.push([
                    'departureDifferenceInMinutes',
                    data[i]['timeTableRows'][x]['differenceInMinutes'],
                  ]);
                }
              }
            }

            // Tehdään taulukosta objekti
            let arrayToObject = Object.fromEntries(new Map(junientiedot));

            // Tallennetaan junien tiedon taulukko asemantiedot taulukkoon
            asemantiedot.push(arrayToObject);
            junientiedot = []; // Tyhjennetään taulukko
          }

          // Tulostetaan saatu tulos
          console.log(asemantiedot);

          // Lähetetään JSON sanomana taulukko eteenpäin.
          res.json(asemantiedot);
        } else {
          // Jos tulee muu kuin 200 vastausviestissä, niin tulostetaan koodi ja virheviesti.
          console.log('Statuskoodi: ' + response.statusCode);
          console.log('Virhe: ' + error);
          res.status(response.statusCode).send([]); // Lähetetään statuskoodi ja tyhjä taulukko.
        }
      });
    });
  },
};

module.exports = AsemaController;

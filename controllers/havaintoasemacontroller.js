const Havaintoasema = require('../models/Havaintoasema');
const Saanyt = require('../models/Saanyt');
const https = require('https'); // XML-parserointiin säätiedosta
const xml2js = require('xml2js'); // XML-parserointiin säätiedosta
const parser = new xml2js.Parser(); // XML-parserointiin säätiedosta

// Asema modellin tuonti
const HavaintoAsemaController = {
  // Haetaan kaikki havaintoasemat
  haeKaikki: (req, res) => {
    Havaintoasema.find((error, havaintoasemat) => {
      if (error) {
        throw error;
      }

      res.json(havaintoasemat);
    });
  },

  // Haetaan tietty havaintoasema nimellä
  haeAsemaNimella: (req, res) => {
    Havaintoasema.findOne({ name: req.params.name }, (error, havaintoasema) => {
      // Jos tulee virhe niin lähetetään virhesanoma
      if (error) {
        throw error;
      }
      res.json(havaintoasema); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },

  // Hae havaintoaseman säätieto. Päivittyy 10 minuutin välein
  haeHavaintoasemanSaa: (req, response) => {
    const fmisid = req.params.fmisid; // Saadaan päivätieto
    const aika = '2021-05-30T08:10:00.000Z'; // Testiaika 

    const x = 1;

    if (x === 1) {
      Saanyt.findOne({ fmisid: req.params.fmisid },  (error, saatieto) => {
        // Jos tulee virhe niin lähetetään virhesanoma
        if (error) {
          throw error;
        }
        response.json(saatieto); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
      });
    } else {
      // Viimeisimmästä säätiedon hausta on yli 10 minuuttia aikaa. Haetaan säätieto ja tallennetaan tietokantaan
      const url =
        'https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::simple&starttime=' +
        aika +
        '&fmisid=' +
        fmisid;

      console.log(url);
      parser.on('error', function (err) {
        console.log('Parser error', err);
      });

      let data = '';
      let taulukko = [];
      https.get(url, function (res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          res.on('data', function (data_) {
            data += data_.toString();
          });
          res.on('end', function () {
            // Tämä tulostaa datan mitä tulee kokonaan
            //console.log('data', data);
            parser.parseString(data, function (err, result) {

              // Lisätään kellonaika taulukkoon
              taulukko.push([['time'].join(), result['wfs:FeatureCollection']['wfs:member'][0][
                'BsWfs:BsWfsElement'
              ][0]['BsWfs:Time'].join()]);

              // Lisätään mittaus arvot taulukkoon
              for (let x = 0; x <= 12; x++) {
                // Haetaan parametrin nimi
                let parametrinimi =
                result['wfs:FeatureCollection']['wfs:member'][x][
                  'BsWfs:BsWfsElement'
                ][0]['BsWfs:ParameterName'].join();

                // Haetaan mittaus tulos
                let parametritulos =
                  result['wfs:FeatureCollection']['wfs:member'][x][
                    'BsWfs:BsWfsElement'
                  ][0]['BsWfs:ParameterValue'].join();

                // Muutetetaan saatu NaN tulos null arvoon, joka tallennetaan tietokantaan.
                if (parametritulos === 'NaN') {
                  taulukko.push([parametrinimi, null]);
                } else {
                  taulukko.push([parametrinimi, Number(parametritulos)]);
                }
              }

              // Lisätään fmisid numero taulukkoon
              taulukko.push(['fmisid', Number(fmisid)]);

              // Muutetaan taulukko objectiksi
              const arrayToObject = Object.fromEntries(new Map(taulukko));

              // Tulostetaan saatu tulos
              console.log(arrayToObject);

              // Tallennetaan saatu tulos tietokantaan
              //const newSaa = Saanyt(arrayToObject);

              //newSaa.save(function (err) {
              //  if (err) {
              //    throw err;
              //  }
              //  console.log('Sää tallennettu.');
              //});

            });
          });
        }
      });

      // Haetaan tiedot tallennuksen jälkeen
      Saanyt.findOne({ fmisid: req.params.fmisid }, (error, saatieto) => {
        // Jos tulee virhe niin lähetetään virhesanoma
        if (error) {
          throw error;
        }
        response.json(saatieto); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
      });
    }
  },
};

module.exports = HavaintoAsemaController;

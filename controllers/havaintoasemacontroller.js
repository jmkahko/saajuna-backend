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

    // const date = new Date();
    // let date1 = new Date(date).toISOString();
    // console.log(date1);

    const aika1 = new Date();
    const aika = Date.UTC(
      aika1.getUTCFullYear(),
      aika1.getUTCMonth(),
      aika1.getUTCDate(),
      aika1.getUTCHours(),
      aika1.getUTCMinutes()
    );

    console.log(new Date(aika));

    const x = 2;

    if (x === 2) {
      Saanyt.findOne({ fmisid: req.params.fmisid }, (error, saatieto) => {
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
              // console.log(result);

              taulukko.push(
                result['wfs:FeatureCollection']['wfs:member'][0][
                  'BsWfs:BsWfsElement'
                ][0]['BsWfs:Time']
              );

              for (let x = 0; x <= 12; x++) {
                let parametritulos =
                  result['wfs:FeatureCollection']['wfs:member'][x][
                    'BsWfs:BsWfsElement'
                  ][0]['BsWfs:ParameterValue'];
                taulukko.push(parametritulos);
              }

              taulukko.push(fmisid);
              console.log(taulukko);
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

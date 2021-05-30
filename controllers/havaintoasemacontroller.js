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

    // Haetaan päivämäärä ja kellonaika
    let aika1 = new Date();
    aika1.setSeconds(0, 0); // Määritellään ajasta sekunnit ja millisekunnit nolliksi

    // Ajan muunnoksia (vuosi, kuukausi, päivä, tunti ja minuutti). Sekunnit ja millisekunnit jätetään pois.
    // FMI käyttää päivämäärä-tiedossaan UTC-aikaa, joten esimerkiksi tunneista pitää vähentää 3, jotta saadaan
    // haku tapahtumaan oikeana aikana.
    let vuosi = aika1.getFullYear();
    let kuukausi = aika1.getMonth() + 1;
    let paiva = aika1.getDate();
    let tunti = aika1.getHours() - 3;
    let minuutti = aika1.getMinutes();
    // Pyöristetään minuutit alaspäin tasakymmenminuuteiksi, koska tieto haetaan fmi:n tietokannasta esim. 13.10, 13.20, 13.30
    minuutti = Math.floor(minuutti / 10) * 10;

    // Lisätään kuukausiin, päiviin, tunteihin ja minuutteihin 0 eteen mikäli ne ovat pienempiä kuin 10.
    // Tällöin saadaan päivämäärätiedot oikeiksi ja määrämuotoisiksi.
    if (kuukausi < 10) {
      kuukausi = '0' + kuukausi;
    }

    if (paiva < 10) {
      paiva = '0' + paiva;
    }

    if (tunti < 10) {
      tunti = '0' + tunti;
    }

    if (minuutti < 10) {
      minuutti = '0' + minuutti;
    }

    // Muodostetaan aika hakua varten määrämuotoisena
    const aika =
      vuosi + '-' + kuukausi + '-' + paiva + 'T' + tunti + ':' + minuutti;

    console.log(aika1);
    console.log(aika);

    const x = 1;

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
              // Lisätään kellonaika taulukkoon
              taulukko.push([
                ['time'].join(),
                result['wfs:FeatureCollection']['wfs:member'][0][
                  'BsWfs:BsWfsElement'
                ][0]['BsWfs:Time'].join(),
              ]);

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
              const newSaa = Saanyt(arrayToObject);

              newSaa.save(function (err) {
                if (err) {
                  throw err;
                }
                console.log('Sää tallennettu.');
              });
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

const Havaintoasema = require('../models/Havaintoasema');
const Saanyt = require('../models/Saanyt');
const Saaennuste = require('../models/Saaennuste');
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
    Havaintoasema.findOne(
      { fmisid: req.params.fmisid },
      (error, havaintoasema) => {
        // Jos tulee virhe niin lähetetään virhesanoma
        if (error) {
          throw error;
        }
        res.json(havaintoasema); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
      }
    );
  },

  // Hae havaintoaseman säätieto. Päivittyy 10 minuutin välein
  haeHavaintoasemanSaa: (req, response) => {
    const fmisid = req.params.fmisid; // Saadaan päivätieto

    // Haetaan viimeisestä tallennuksesta kellonaika milloin havainto on tehty
    Saanyt.findOne(
      { fmisid: req.params.fmisid },
      { _id: false, time: true },
      (error, kellonaika) => {
        // Jos tulee virhe niin lähetetään virhesanoma
        if (error) {
          throw error;
        }

        // Haetaan päivämäärä ja kellonaika
        let aika1 = new Date();
        aika1.setSeconds(0, 0); // Määritellään ajasta sekunnit ja millisekunnit nolliksi

        // Ajan muunnoksia (vuosi, kuukausi, päivä, tunti ja minuutti). Sekunnit ja millisekunnit jätetään pois.
        // FMI käyttää päivämäärä-tiedossaan UTC-aikaa, joten esimerkiksi tunneista pitää vähentää 3, jotta saadaan
        // haku tapahtumaan oikeana aikana.
        let vuosi = aika1.getFullYear();
        let kuukausi = aika1.getMonth() + 1;
        let paiva = aika1.getDate();
        let tunti = aika1.getHours() - 3; // Ottaa tämä pois, kun siirtää Herokuuhun. Muuten ei toimi UTC aika
        let minuutti = aika1.getMinutes();
        // Pyöristetään minuutit alaspäin tasakymmenminuuteiksi, koska tieto haetaan fmi:n tietokannasta esim. 13.10, 13.20, 13.30
        minuutti = Math.floor(minuutti / 10) * 10;

        // Lisätään kuukausiin, päiviin, tunteihin ja minuutteihin 0 eteen mikäli ne ovat pienempiä kuin 10.
        // Tällöin saadaan päivämäärätiedot oikeiksi ja määrämuotoisiksi hakua varten.
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

          console.log('Aika ennen muutosta ' + aika);

          
          console.log('Aika muutoksen jälkeen ' + aika)
        // Lasketaan erotus millisekunteina
        let erotus =
          new Date(kellonaika.time).getTime() - new Date(aika).getTime();
        let erotusminuuttia = erotus / 60000;

        // Tulostetaan kuluva aika, tietokantaan tallennettu viimeisin, paljonko erotus ajoissa
        console.log(aika1);
        console.log(kellonaika.time);
        console.log(erotusminuuttia);
        console.log(erotus);

        if (erotusminuuttia === 180) {
          Saanyt.findOne({ fmisid: req.params.fmisid }, (error, saatieto) => {
            // Jos tulee virhe niin lähetetään virhesanoma
            if (error) {
              throw error;
            }
            response.json(saatieto); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
          }).sort({ _id: -1 });
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
          // Luodaan taulukko, johon data haetaan
          let data = '';
          let taulukko = [];
          https.get(url, function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
              res.on('data', function (data_) {
                data += data_.toString();
              });
              res.on('end', function () {
                // Parseroidaan saatu tulos result muuttujaan
                parser.parseString(data, function (err, result) {
                  // Tehdään try catch menettelyllä tietojen tallennus. Jos XML on tyhjä, niin ohjelman suoritus ei lakkaa kokonaan.
                  try {
                    // Lisätään kellonaika taulukkoon
                    taulukko.push([
                      'time',
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
                  } catch (e) {
                    console.log('Tietojen haku epäonnistui');
                    console.error(e.message);
                  } finally {
                    // Lisätään tiedon hakuun viive tallennuksen jälkeen, muuten tuloksena tulee vanha tallennus eikä nyt haettu tieto
                    setTimeout(tallennuksenhaku, 1000);

                    function tallennuksenhaku() {
                      // Lähetetään viimeisin mittaustulos
                      Saanyt.findOne(
                        { fmisid: req.params.fmisid },
                        (error, saatieto) => {
                          // Jos tulee virhe niin lähetetään virhesanoma
                          if (error) {
                            throw error;
                          }
                          response.json(saatieto); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
                        }
                      ).sort({ _id: -1 });
                    }
                  }
                });
              });
            }
          });
        }
      }
    ).sort({ _id: -1 });
  },

  // Hae paikkakunnan sääennuste. Saadaan tunnin välein
  haeAsemaSaaEnnuste: (req, response) => {
    const place = req.params.place; // Saadaan paikkakunta

    let aika1 = new Date();
    aika1.setSeconds(0, 0); // Määritellään ajasta sekunnit ja millisekunnit nolliksi

    // Ajan muunnoksia (vuosi, kuukausi, päivä, tunti ja minuutti). Sekunnit ja millisekunnit jätetään pois.
    // FMI käyttää päivämäärä-tiedossaan UTC-aikaa, joten esimerkiksi tunneista pitää vähentää 3, jotta saadaan
    // haku tapahtumaan oikeana aikana.
    let vuosi = aika1.getFullYear();
    let kuukausi = aika1.getMonth() + 1;
    let paiva = aika1.getDate();
    let tunti = aika1.getHours() - 3; // Ottaa tämä pois, kun siirtää Herokuuhun. Muuten ei toimi UTC aika

    // Lisätään kuukausiin, päiviin, tunteihin ja minuutteihin 0 eteen mikäli ne ovat pienempiä kuin 10.
    // Tällöin saadaan päivämäärätiedot oikeiksi ja määrämuotoisiksi hakua varten.
    if (kuukausi < 10) {
      kuukausi = '0' + kuukausi;
    }

    if (paiva < 10) {
      paiva = '0' + paiva;
    }

    if (tunti < 10) {
      tunti = '0' + tunti;
    }

    // Muodostetaan aika hakua varten määrämuotoisena
    const aika =
      vuosi + '-' + kuukausi + '-' + paiva + 'T' + tunti + ':' + '00';

    Saaennuste.findOne(
      { place: req.params.place },
      { _id: false, time: true },
      (error, kellonaika) => {
        // Jos tulee virhe niin lähetetään virhesanoma
        if (error) {
          throw error;
        }

        // Lasketaan erotus millisekunteina
        let erotus =
          new Date(kellonaika.time).getTime() - new Date(aika).getTime();
        let erotustunnit = erotus / 60000 / 60;

        // Tulostetaan kuluva aika, tietokantaan tallennettu viimeisin, paljonko erotus ajoissa
        console.log(aika1);
        console.log(kellonaika.time);
        console.log(erotustunnit);
        console.log(erotus);

        if (erotustunnit === 3) {
          Saaennuste.findOne(
            { place: req.params.place },
            (error, saaennuste) => {
              // Jos tulee virhe niin lähetetään virhesanoma
              if (error) {
                throw error;
              }
              response.json(saaennuste); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
            }
          ).sort({ _id: -1 });
        } else {
          // Viimeisimmästä säätiedon hausta on yli 10 minuuttia aikaa. Haetaan säätieto ja tallennetaan tietokantaan

          const url =
            'https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple&starttime=' +
            aika +
            '&endtime=' +
            aika +
            '&place=' +
            place;

          console.log(url);
          parser.on('error', function (err) {
            console.log('Parser error', err);
          });
          // Luodaan taulukko, johon data haetaan
          let data = '';
          let taulukko = [];
          https.get(url, function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
              res.on('data', function (data_) {
                data += data_.toString();
              });
              res.on('end', function () {
                // Parseroidaan saatu tulos result muuttujaan
                parser.parseString(data, function (err, result) {
                  // Tehdään try catch menettelyllä tietojen tallennus. Jos XML on tyhjä, niin ohjelman suoritus ei lakkaa kokonaan.

                  try {
                    // Lisätään kellonaika taulukkoon

                    taulukko.push([
                      'time',
                      result['wfs:FeatureCollection']['wfs:member'][0][
                        'BsWfs:BsWfsElement'
                      ][0]['BsWfs:Time'].join(),
                    ]);

                    // Lisätään mittaus arvot taulukkoon
                    for (let x = 0; x <= 23; x++) {
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

                    // Lisätään paikkakunta taulukkoon
                    taulukko.push(['place', place]);

                    // Muutetaan taulukko objectiksi
                    const arrayToObject = Object.fromEntries(new Map(taulukko));

                    // Tulostetaan saatu tulos
                    console.log(arrayToObject);

                    // Tallennetaan saatu tulos tietokantaan
                    const newSaaEnnuste = Saaennuste(arrayToObject);

                    newSaaEnnuste.save(function (err) {
                      if (err) {
                        throw err;
                      }
                      console.log('Sääennuste tallennettu.');
                    });
                  } catch (e) {
                    console.log('Tietojen haku epäonnistui');
                    console.error(e.message);
                  } finally {
                    // Lisätään tiedon hakuun viive tallennuksen jälkeen, muuten tuloksena tulee vanha tallennus eikä nyt haettu tieto
                    setTimeout(tallennuksenhaku, 1000);

                    function tallennuksenhaku() {
                      // Lähetetään viimeisin mittaustulos
                      Saaennuste.findOne(
                        { place: req.params.place },
                        (error, saaennuste) => {
                          // Jos tulee virhe niin lähetetään virhesanoma
                          if (error) {
                            throw error;
                          }
                          console.log('tuleeko tieto');
                          response.json(saaennuste); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
                        }
                      ).sort({ _id: -1 });
                    }
                  }
                });
              });
            }
          });
        }
      }
    ).sort({ _id: -1 });
  },
};

module.exports = HavaintoAsemaController;

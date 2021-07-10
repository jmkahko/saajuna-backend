const Havaintoasema = require('../models/Havaintoasema'); //havaintoaseman mallli
const Saanyt = require('../models/Saanyt'); //tämän hetkisen sää malli
const Saaennuste = require('../models/Saaennuste'); // sääennusteen malli
const https = require('https'); // XML-parserointiin säätiedosta
const xml2js = require('xml2js'); // XML-parserointiin säätiedosta
const parser = new xml2js.Parser(); // XML-parserointiin säätiedosta

// Havaintoaseman modelin tuonti
const HavaintoAsemaController = {
  // Haetaan kaikki säähavaintoasemat.
  haeKaikki: (req, res) => {
    Havaintoasema.find((error, havaintoasemat) => {
      if (error) {
        console.log(error); //tulostetaan saatu virhe
        res.json(error); //lähetetään saatu virhe JSONina
      }
      res.json(havaintoasemat); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },
  //  EI TARVITA
  // Haetaan tietty havaintoasema nimellä
  // haeAsemaNimella: (req, res) => {
  //   Havaintoasema.findOne(
  //     { fmisid: req.params.fmisid },
  //     (error, havaintoasema) => {
  //       // Jos tulee virhe niin lähetetään virhesanoma
  //       if (error) {
  //         console.log(error); //tulostetaan saatu virhe
  //         res.json(error); //lähetetään saatu virhe JSONina
  //       }
  //       res.json(havaintoasema); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
  //     }
  //   );
  // },

  // Haetaan tietty havaintoasema aseman ID:llä
  haeAsemaIDlla: (req, res) => {
    Havaintoasema.findOne({ _id: req.params.id }, (error, havaintoasema) => {
      // Jos tulee virhe, niin lähetetään virhesanoma.
      if (error) {
        console.log(error); //Tulostetaan saatu virhe
        res.json(error); //Lähetetään saatu virhe JSONina.
      }
      res.json(havaintoasema); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin
    });
  },

  // Haetaan havaintoaseman säätieto. Säätieto päivittyy 10 minuutin välein Ilmatieteen laitoksen tietokannasta.
  haeHavaintoasemanSaa: (req, response) => {
    const fmisid = req.params.fmisid; // Saadaan päivätieto

    // Haetaan viimeisestä tallennuksesta kellonaika, milloin viimeisin havainto on tehty.
    Saanyt.findOne(
      { fmisid: req.params.fmisid }, //Haetaan havaintoaseman fmisid-tunnuksella
      { _id: false, time: true },
      (error, kellonaika) => {
        // Jos tulee virhe, niin lähetetään virhesanoma.
        if (error) {
          console.log(error); //Tulostetaan saatu virhe
          response.json(error); //Lähetetään saatu virhe JSONina.
        }

        // Haetaan päivämäärä ja kellonaika
        let aika1 = new Date();
        aika1.setSeconds(0, 0); // Määritellään ajasta sekunnit ja millisekunnit nolliksi, koska niitä ei tarvita haussa.

        // Ajan muunnoksia (vuosi, kuukausi, päivä, tunti ja minuutti). Sekunnit ja millisekunnit jätetään pois, koska niitä ei tarvita haussa.
        // FMI käyttää päivämäärä-tiedossaan UTC-aikaa, joten esimerkiksi tunneista pitää vähentää 3 h, jotta saadaan
        // haku tapahtumaan oikeana aikana.
        let vuosi = aika1.getFullYear(); //Haetaan ajasta vuosi-tieto.
        let kuukausi = aika1.getMonth() + 1; //Haetaan ajasta kuukausi-tieto.
        let paiva = aika1.getDate(); //Haetaan ajasta päivä-tieto.

        // Heroku / paikallisesti ajettava
        let tunti = aika1.getHours() -3; // Ota tämä -3 arvo pois, kun siirretään Herokuhun, koska muuten ei toimi UTC aika. Haetaan ajasta tunti-tieto.

        let minuutti = aika1.getMinutes(); //Haetaan ajasta minuutti-tieto.

        // Pyöristetään minuutit alaspäin tasakymmenminuuteiksi, koska tieto haetaan fmi:n tietokannasta esim. 13.10, 13.20, 13.30
        minuutti = Math.floor(minuutti / 10) * 10;

        // Lisätään kuukausiin, päiviin, tunteihin ja minuutteihin 0 eteen, mikäli ne ovat pienempiä kuin 10.
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

        // Muodostetaan aika hakua varten UTC-muotoisena
        const aika =
          vuosi + '-' + kuukausi + '-' + paiva + 'T' + tunti + ':' + minuutti;

        // Tulostetaan konsoliin ajat
        //console.log('Aika ennen muutosta ' + aika);
        //console.log('Aika muutoksen jälkeen ' + aika);

        // Lasketaan erotus millisekunteina
        let erotus;
        if (!error) {
          //jos ajanhaussa ei tule virhettä, lasketaan erotus normaalisti
          erotus =
            new Date(kellonaika.time).getTime() - new Date(aika).getTime();
        } else {
          console.log(error); // jos ajanhaussa tulee virhe, tulostetaan virhe.
        }

        let erotusminuuttia = erotus / 60000;

        // Tulostetaan kuluva aika, tietokantaan tallennettu viimeisin, paljonko erotus ajoissa
        //console.log(aika1);
        //console.log(kellonaika.time);
        //console.log(erotusminuuttia);
        //console.log(erotus);

        // Tarkistetaan, että onko kulunut yli 10 minuuttia, jos ei ole niin haetaan tietokannasta, muuten haku tehdään Ilmatieteen laitoksen avoimesta datasta.
        if (erotusminuuttia === 180) {
          Saanyt.findOne({ fmisid: req.params.fmisid }, (error, saatieto) => {
            // Jos tulee virhe, niin lähetetään virhesanoma.
            if (error) {
              console.log(error); //Tulostetaan saatu virhe.
              res.json(error); //Lähetetään saatu virhe JSONina.
            }
            response.json(saatieto); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin.
          }).sort({ _id: -1 });
        } else {
          // Kun viimeisimmästä säätiedon hausta on yli 10 minuuttia aikaa, haetaan säätieto Ilmatieteen laitokselta ja tallennetaan se tietokantaan.
          // Muodostetaan hakulinkki, jolla haetaan säätiedot Ilmatieteen laitoksen avoimesta datasta. Linkkiin määritellään hakuaika ja havaintoaseman fmisid-tieto.
          const url =
            'https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::simple&starttime=' +
            aika +
            '&fmisid=' +
            fmisid;

          //console.log(url); // Saadaan haku url tulostettua

          // Parseroidaan XML sanomasta haluttu data
          parser.on('error', function (err) {
            //console.log('Parser error', err);
          });

          // Luodaan taulukko, johon säädata haetaan.
          let data = '';
          let taulukko = [];

          https.get(url, function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
              res.on('data', function (data_) {
                data += data_.toString();
              });
              res.on('end', function () {
                // Parseroidaan saatu tulos result muuttujaan.
                parser.parseString(data, function (err, result) {
                  // Tehdään try catch menettelyllä tietojen tallennus. Jos XML on tyhjä, niin ohjelman suoritus ei lakkaa kokonaan.
                  try {
                    // Lisätään kellon aika taulukkoon.
                    taulukko.push([
                      'time',
                      result['wfs:FeatureCollection']['wfs:member'][0][
                        'BsWfs:BsWfsElement'
                      ][0]['BsWfs:Time'].join(),
                    ]);

                    // Lisätään mittausarvot taulukkoon.
                    for (let x = 0; x <= 12; x++) {
                      // Haetaan parametrin nimi.
                      let parametrinimi =
                        result['wfs:FeatureCollection']['wfs:member'][x][
                          'BsWfs:BsWfsElement'
                        ][0]['BsWfs:ParameterName'].join();

                      // Haetaan mittaustulos.
                      let parametritulos =
                        result['wfs:FeatureCollection']['wfs:member'][x][
                          'BsWfs:BsWfsElement'
                        ][0]['BsWfs:ParameterValue'].join();

                      // Muutetetaan saatu NaN tulos null-arvoiseksi ja se tallennetaan tietokantaan.
                      if (parametritulos === 'NaN') {
                        taulukko.push([parametrinimi, null]);
                      } else {
                        taulukko.push([parametrinimi, Number(parametritulos)]);
                      }
                    }

                    // Lisätään säähavaintoaseman fmisid-numero taulukkoon.
                    taulukko.push(['fmisid', Number(fmisid)]);

                    // Muutetaan taulukko objektiksi.
                    const arrayToObject = Object.fromEntries(new Map(taulukko));

                    // console.log(arrayToObject); // Tulostetaan saatu tulos

                    // Tallennetaan saatu tulos tietokantaan.
                    const newSaa = Saanyt(arrayToObject);

                    newSaa.save(function (err) {
                      if (err) {
                        console.log(err); //Tulostetaan saatu virhe.
                        res.json(err); //Lähetetään saatu virhe JSONina.
                      }
                      console.log('Säätiedot tallennettu.');
                    });
                  } catch (e) {
                    // Jos tuli virhe, tulostetaan virhe
                    console.log('Tietojen haku epäonnistui');
                    console.error(e.message);
                  } finally {
                    // Lisätään tiedon hakuun viive tallennuksen jälkeen, koska muuten tuloksena tulee vanha tallennus eikä nyt haettu tieto.
                    setTimeout(tallennuksenhaku, 1000);

                    function tallennuksenhaku() {
                      // Lähetetään viimeisin mittaustulos.
                      Saanyt.findOne(
                        { fmisid: req.params.fmisid },
                        (error, saatieto) => {
                          // Jos tulee virhe, niin lähetetään virhesanoma
                          if (error) {
                            console.log(error); //Tulostetaan saatu virhe.
                            res.json(error); //Lähetetään saatu virhe JSONina.
                          }
                          response.json(saatieto); // Lähetetään JSONina tietokannasta saatu tieto eteenpäin.
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

  // Hae paikkakunnan sääennuste koordinaateilla. Sääennuste saadaan tunnin välein Ilmatieteen laitokselta.
  haeAsemaSaaEnnuste: (req, response) => {
    const latlon = req.params.latlon; // Saadaan pituus- ja leveysasteen koordinaatit.

    let aika1 = new Date();
    aika1.setSeconds(0, 0); // Määritellään ajasta sekunnit ja millisekunnit nolliksi, koska niitä ei tarvita haussa.

    // Ajan muunnoksia (vuosi, kuukausi, päivä, tunti ja minuutti). Sekunnit ja millisekunnit jätetään pois, koska niitä ei tarvita hakua varten.
    // FMI käyttää päivämäärä-tiedossaan UTC-aikaa, joten esimerkiksi tunneista pitää vähentää 3 h, jotta saadaan
    // haku tapahtumaan oikeana aikana.
    let vuosi = aika1.getFullYear();
    let kuukausi = aika1.getMonth() + 1;
    let paiva = aika1.getDate();

    // Jos laitetaan Herokuhun, laitetaan tämä rivi kommenttiin
    let tunti = aika1.getHours() -3; // Laittaa -3 arvo kommenttiin, jos Herokussa, koska muuten ei toimi UTC aika.

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

    // Muodostetaan aika hakua varten määrämuotoisena.
    const aika =
      vuosi + '-' + kuukausi + '-' + paiva + 'T' + tunti + ':' + '00';

    // console.log(aika1); // Tulostetaan kuluva aika, tietokantaan tallennettu viimeisin, paljonko erotus ajoissa

    // luodaan url linkki hakua varten. Linkkiin määritellään hakuaika ja koordinaatit.
    const url =
      'https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple&starttime=' +
      aika +
      '&endtime=' +
      aika +
      '&latlon=' +
      latlon;

    // console.log(url); // Tulostetaan url
    parser.on('error', function (err) {
      console.log('Parser error', err);
    });
    // Luodaan taulukko, johon data haetaan.
    let data = '';
    let taulukko = [];
    https.get(url, function (res) {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        res.on('data', function (data_) {
          data += data_.toString();
        });
        res.on('end', function () {
          // Parseroidaan saatu tulos result muuttujaan.
          parser.parseString(data, function (err, result) {
            // Tehdään try catch menettelyllä tietojen tallennus. Jos XML on tyhjä, niin ohjelman suoritus ei lakkaa kokonaan.
            try {
              taulukko.push([
                'time',
                result['wfs:FeatureCollection']['wfs:member'][0][
                  'BsWfs:BsWfsElement'
                ][0]['BsWfs:Time'].join(),
              ]);

              // Lisätään mittaus arvot taulukkoon.
              for (let x = 0; x <= 23; x++) {
                // Haetaan parametrin nimi.
                let parametrinimi =
                  result['wfs:FeatureCollection']['wfs:member'][x][
                    'BsWfs:BsWfsElement'
                  ][0]['BsWfs:ParameterName'].join();

                // Haetaan mittaus tulos.
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

              // Lisätään koordinaatit taulukkoon.
              taulukko.push(['latlon', latlon]);

              // Muutetaan taulukko objektiksi.
              const arrayToObject = Object.fromEntries(new Map(taulukko));

              // Tulostetaan saatu tulos.
              console.log(arrayToObject);

              // Tallennetaan saatu tulos tietokantaan.
              const newSaaEnnuste = Saaennuste(arrayToObject);

              response.json(newSaaEnnuste);
            } catch (e) {
              // Jos tuli virhe, tulostetaan virhe.
              console.log('Tietojen haku epäonnistui');
              console.error(e.message);
            } finally {
            }
          });
        });
      }
    });
  },
};

module.exports = HavaintoAsemaController;

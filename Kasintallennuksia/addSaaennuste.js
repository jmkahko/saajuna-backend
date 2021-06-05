//----------TALLENNUS-------------------------------//
// Tallennetaan uusi sääennuste tietokantaan
const Saaennuste = require('./models/Saaennuste');
require('./dbconnection');
const newSaaennusteObject = require('./newSaaennusteObject');
// //tallennettava tieto oliona
// eslint-disable-next-line new-cap
const newSaaennuste = Saaennuste(newSaaennusteObject);

// //Olion tallennus Mongoosen save -metodilla.

newSaaennuste.save(function (err) {
  if (err) {
    throw err;
  }
  console.log('Sääennuste tallennettu.');
});

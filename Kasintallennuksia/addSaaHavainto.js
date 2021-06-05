//----------TALLENNUS-------------------------------//
// Tallennetaan uusi säähavainto tietokantaan
const Saanyt = require('./models/Saanyt');
require('./dbconnection');
const newSaaHavaintoObject = require('./newSaaHavaintoObject');
// //tallennettava tieto oliona
// eslint-disable-next-line new-cap
const newSaa = Saanyt(newSaaHavaintoObject);

// //Olion tallennus Mongoosen save -metodilla.

newSaa.save(function (err) {
  if (err) {
    throw err;
  }
  console.log('Sää tallennettu.');
});

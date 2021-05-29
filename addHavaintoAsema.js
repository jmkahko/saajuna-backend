//----------TALLENNUS-------------------------------//
const Havaintoasema = require('./models/Havaintoasema');
require('./dbconnection');
const newHavaintoasemaObject = require('./newHavaintoAsemaObject');
// //tallennettava tieto oliona
// eslint-disable-next-line new-cap
const newAsema = Havaintoasema(newHavaintoasemaObject);

// //Olion tallennus Mongoosen save -metodilla.

newAsema.save(function (err) {
  if (err) {
    throw err;
  }
  console.log('Asema tallennettu.');
});

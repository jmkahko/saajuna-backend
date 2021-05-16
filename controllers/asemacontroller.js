// Asema modellin tuonti
const Asema = require('../models/Asema');

const AsemaController = {
  // Haetaan kaikki asemat
  findAll: (req, res) => {
    Asema.find((error, asemat) => {
      if (error) {
        throw error;
      }

      res.json(asemat);
    });
  },

  updateAsemat: (req, res) => {
    Asema.find((error, asemat) => {
      if (error) {
        throw error;
      }

      res.json(asemat);
    });
  },
};

module.exports = AsemaController;

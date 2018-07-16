// //////////////////////////////////////////////////////////////////////////////////////
//  SERVER/CONTROLLERS/CONTROLLER_NAME_PLURAL.JS FILE (CONTROLLER for a MODEL ):
// ///////////////////////////////////////////////////////////////////////////////////////
// Require Mongoose module in the following files:
// - mongoose.js file,
// - HERE,
// - SCHEMA/MODEL file.
// ///////////////////////////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
const mongoose = require('mongoose');

const Sideone = mongoose.model('Sideone');
const Sidetwo = mongoose.model('Sidetwo');

module.exports = {
  getTiles(request, response) {
    Sideone.find({}).then((sideOneTiles) => {
      Sidetwo.find({}).then((sideTwoTiles) => {
        response.json({ sideOne: sideOneTiles, sideTwo: sideTwoTiles });
      });
    });
  },
};

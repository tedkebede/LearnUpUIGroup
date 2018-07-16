// ////////////////////////////////////////////////////////////////
//  SERVER/CONFIG/MONGOOSE.JS (DATABASE CONFIG FILE):
// ////////////////////////////////////////////////////////////////
// Require Mongoose module in the following files:
// - HERE,
// - SCHEMA/MODEL file,
// - CONTROLLER file.
// ////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
const mongoose = require('mongoose');

// Use native promises
mongoose.Promise = global.Promise;

// STEP 2 (DB/SCHEMA SETUP): Connect to Mongoose:
// http://mongoosejs.com/docs/connections.html#use-mongo-client (will avoid the open() deprec warning on connect())
mongoose.connect('mongodb://localhost/learnup-db', {useMongoClient: true}); // <---- CHANGE DB NAME
// Or, if you already have a connection, use .openUri()
// connection.openUri('mongodb://localhost/myapp', { /* options */ });

// [ FOR STEP 3 (DB/SCHEMA SETUP) => CREATE MODEL in './../MODELS/' ]
// [ FOR STEP 4 (DB/SCHEMA SETUP) => CREATE CONTROLLER FILE in
// './../CONTROLLERS/' and EXPORT CONTROLLER METHODS TO ROUTES.JS]

// Require the fs module for loading model files
const fs = require('fs');

// Require 'path' to retrieve models directory path:
const path = require('path');

// 'modelsPath' points to the path where all of the models live:
const modelsPath = path.join(__dirname, './../models');
// (if not using 'path' module, use:
// var modelsPath = express.static(__dirname + './../models/' );

// Read all of the files within above 'modelsPath':
fs.readdirSync(modelsPath).forEach((file) => {
  if (file.indexOf('.js') >= 0) {
    // Require each of the model.js files into current file:
    require(`${modelsPath}/${file}`);
  }
});


// FOR TESTING - ADDS/CREATES DEFAULT USER IF NONE EXISTS IN DB:
const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 'Dojo2017';

// IMPORT dummy users data FROM 'dummy_users' file IN THIS DIRECTORY:
const users = require('./dummy_users');

const User = mongoose.model('User');
function addAccount(user) {
  // user.password is hashed and returned into 'hash' on success:
  bcrypt.hash(user.password, saltRounds).then((hash) => {
    User.create({
      email: user.email,
      hash,
      admin: user.admin,
    }).then(result => console.log("Dummy user created: ", result));
  });
}

function addDummyAccounts(dummyUsers) {
  dummyUsers.forEach((user) => {
    addAccount(user);
  });
}

User.findOne({ email: 'learnup2017@gmail.com' }, (error, result) => {
  // console.log("In mongoose.js: findOne({learnup2017@gmail.com})");
  if (error) {
    console.log("In mongoose file with error on find user email method:", error);
  } else if (!result) {
    // console.log("In mongoose.js: findOne({learnup2017@gmail.com}) - no result returned, creating default users...");
    addDummyAccounts(users);
  }
});

// ADD TILES TO DB (if database not yet populated)
const tilesSideOne = require('../../static/tilesSideOne.json');
const tilesSideTwo = require('../../static/tilesSideTwo.json');

const Sideone = mongoose.model('Sideone');
const Sidetwo = mongoose.model('Sidetwo');

function addTiles(tiles) {
  const {
    starstop, starsleft, starsright, starsright2, starsbottom, dipper, dipper2, crescent, earth,
  } = tilesSideOne.sideone;

  const {
    prefixes, endingsright, endingsbottom, roots,
  } = tilesSideTwo.sidetwo;

  Sideone.create({
    starstop,
	starsright,
	starsright2,
    starsleft,
    starsbottom,
	dipper,
	dipper2,
    crescent,
    earth,
  })
    .then(data => console.log(data))
    .catch(error => console.log(error));

  Sidetwo.create({
    prefixes,
    endingsright,
    endingsbottom,
    roots,
  })
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

Sideone.findOne({})
  .then((tiles) => {
      addTiles(tiles);
  })
  .catch(error => console.log(error));

Sidetwo.findOne({})
  .then((tiles) => {
      addTiles(tiles);
  })
  .catch(error => console.log(error));

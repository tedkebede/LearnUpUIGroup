// ////////////////////////////////////////////////////////////////////////
//  SERVER/MODELS/MODEL_NAME_SINGULAR.JS FILE [ SCHEMA / MODEL]
// ////////////////////////////////////////////////////////////////////////
// Require Mongoose module (STEP 1) in the following files:
// - mongoose.js file,
// - CONTROLLER file,
// - HERE.
// ////////////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
const mongoose = require('mongoose');

// STEP 3 (DB/SCHEMA SETUP):
// Name & Describe Schema:
const SideOneSchema = new mongoose.Schema(
  {
    // <--- SET MODEL NAME & DESCRIBE MODEL'S SCHEMA
    starstop: [{ text: String, color: String }],
    starsleft: [{ text: String, color: String }],
	starsright: [{ text: String, color: String }],
	starsright2: [{ text: String, color: String }],
    starsbottom: [{ text: String, color: String }],
	dipper: [{ text: String, color: String }],
	dipper2: [{ text: String, color: String }],
    crescent: [{ text: String, color: String }],
    earth: [{ text: String, color: String }],
  },
  { timestamps: true },
);

// Set this Schema in our Models as 'Schema_Instance':
mongoose.model('Sideone', SideOneSchema); // <-- NAME YOUR MODEL INSTANCE

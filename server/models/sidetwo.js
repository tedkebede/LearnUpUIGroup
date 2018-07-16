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
const SideTwoSchema = new mongoose.Schema(
  {
    // <--- SET MODEL NAME & DESCRIBE MODEL'S SCHEMA
    prefixes: [{ text: String, color: String }],
    endingsright: [{ text: String, color: String }],
    endingsbottom: [{ text: String, color: String }],
    roots: [{ text: String, color: String }],
  },
  { timestamps: true },
);

// Set this Schema in our Models as 'Schema_Instance':
mongoose.model('Sidetwo', SideTwoSchema); // <-- NAME YOUR MODEL INSTANCE

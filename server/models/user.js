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
const UserSchema = new mongoose.Schema(
  {
    // <--- SET MODEL NAME & DESCRIBE MODEL'S SCHEMA
    email: { type: String, required: true },
    hash: { type: String, required: true },
    admin: { type: Number, required: true },
    resettoken: { type: String, required: false },
    passwordReset: { type: Number, required: false}
  },
  { timestamps: true },
);

// Set this Schema in our Models as 'Schema_Instance' (this is a table/collection name):
mongoose.model('User', UserSchema); // <-- NAME YOUR MODEL INSTANCE
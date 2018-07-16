// ////////////////////////////////////////////////
// LEARN_UP/SERVER.JS FILE:
// ////////////////////////////////////////////////

// REQUIRE EXPRESS & SESSION MODULES:
// ==================================
// Require 'session' Module (prior to invoking Express):
// FOR SESSION STORE configs below REFER TO: https://github.com/expressjs/session#session-store-implementation
const session = require('express-session');

var player = require('play-sound')(opts = {})

// REQUIRE AND DECLARE A SESSION STORE:
const MongoStore = require('connect-mongo')(session);

// ~~~~~~~~~~~~~~~~> INCLUDE REASON FOR USE:
const cookieParser = require('cookie-parser');

// Require flash messaging
const flash = require('connect-flash');
// Require the 'express' Module - to handle requests:

const express = require('express');
// Create an express application:
// i.e. invoke 'express' Module and send it to 'app' variable:
const app = express();

// Tell express 'app' to use cookie-parser
app.use(cookieParser());

// Require mongoose configuration file(s) ( mongoose.js ):
// ( This file also included the Promise library... )
require('./server/config/mongoose.js');

// Require Mongoose Module (prior to routes section,  after 'app' variable definition).
// Connects express 'app' to mongodb (Mongo database):
const mongoose = require("mongoose");

const connection = mongoose.createConnection("mongodb://localhost/learnup-db/session");
// Because we import the mongoose.js file first, the mongoose is already set up with a promiseLibrary. Otherwise do:
// mongoose.createConnection("mongodb://localhost/learnup-db/session", {promiseLibrary: global.Promise});




// Tell express 'app' to use 'session', and
// give 'session' a dummy string for encryption:
app.use(session({ secret: 'codingdojorocks',
// https://www.npmjs.com/package/express-session#cookiesecure 
// (add the "resave" and the "saveUninitialized" options to avoid session module [none were set] warnings)
                  resave: false, // don't save session if unmodified
                  saveUninitialized: false, // don't create session until something stored
                  store: new MongoStore({ mongooseConnection: connection})
                    // https://www.npmjs.com/package/connect-mongo (for advance usage with mongoOptions)
}));

app.use(flash());

// BODYPARSER MODULE CONFIGS:
// ===========================
// Require 'body-parser' Module - to receive post data from clients:
const bodyParser = require('body-parser');

// Tell express 'app' to use bodyParser:

app.use(bodyParser.urlencoded({ extended: true }));
// This notation allows for parsing of key-value pairs, where the value can be a string or array
// (when extended is false), or any type (when extended is true).
// The "extended" syntax allows for rich objects
// and arrays to be encoded into the URL-encoded format,
// allowing for a JSON-like experience with URL-encoded.
// https://github.com/expressjs/body-parser for more info on "bodyParser.urlencoded([options]).

app.use(bodyParser.json());
// This notation allows for parsing of JSON objects.
// ====================================================

// Require 'path' Module:
// (provides utilities for working with file and directory paths)
const path = require('path');

// SET STATIC & VIEWS DIRECTORIES:
// =====================================
// Set View Engine to EJS:
app.set('view engine', 'ejs');

// Set Static Folder Directory (w/ front-end Angular):
// app.use(express.static(__dirname + '/public/dist/' ));
// -> front-end application directory name has to match above (i.e. "public")

// Set Static Folder Directory (w/o front-end):
app.use(express.static(path.join(__dirname, './static')));

// Set Views Folder Directory:
app.set('views', path.join(__dirname, './views'));
// '__dirname' holds this path: C:\<your_local_project_directory_path>

// ROUTES:
// =======================================
// Require a routes.js file for server.js
const routesSetter = require('./server/config/routes.js');
// Invoke routes.js:
routesSetter(app);

// ////////////////////////////////////////////
// Start Node 'server' listening on port 8000:
// ////////////////////////////////////////////
const server = app.listen(8000, () => {
  console.log('Listening to port 8000');
});

// Server SOCKET.IO Setup:
// ==============================================
// Require 'socket.io' Module & tell it to listen to 'server':
const io = require('socket.io').listen(server);

// Returns an "io" object to control sockets!

// SETUP a 'connection' EVENT to listen to any client that connects to our server socket:
io.sockets.on('connection', (socket) => {
  console.log('Client/socket is connected!');
  console.log('Client/socket id is: ', socket.id);
  // all the server socket code goes in here ...

  socket.on('button_clicked', (data) => {
    // Display 'data' object received in server console / terminal:
    console.log(`Someone clicked a button! Reason: ${data.reason}`);
    // Respond to client: emit another event and send a 'response' data object back to client:
    socket.emit('server_response', { response: 'sockets are the best!' });
  });

  socket.on('create', (room) => {
    console.log('created room');
    socket.join(room);
    io.to(room).emit('user_joined', { response: `user created room ${room}` });
  });

  //user joins room
  socket.on('join room', (room) => {
    console.log('joined room', room);
    socket.join(room);
    console.log(socket.adapter.rooms[room]);

    var destination = '/';

    if (socket.adapter.rooms[room].length <= 2) {
      io.to(room).emit('user_joined', { response: `user joined room ${room}`, users: socket.adapter.rooms[room].length });
    }
    else if (socket.adapter.rooms[room].length > 2) {
      socket.emit('full', destination);
    }
  });

  // indicates if user has tab hidden or minimized
  socket.on('paying_attention_status', (roomName, attentionStatus) => {
    var roomLength = 0;
    
    for (room in socket.adapter.rooms) {
      if (room == roomName) {
        continue;
      }
      roomLength++;
    }

    socket.on('disconnect', (room) => {
      console.log("user disconnected");
      roomLength--;
      console.log("decrease", roomLength);
      io.to(roomName).emit('user disconnected');
    });

    if (roomLength == 2) { 
      console.log("has two members");
      io.to(roomName).emit('attention_status', {response: `user ${socket.id} is paying attention: ${attentionStatus}`});
    } 

  });

  socket.on('leave room', (room) => {
    console.log('In leave room',room);
    socket.leave('room', function (err) {
      // console.log(err); // display null
      // console.log(socket.adapter.rooms[room])
    });
  })

  socket.on('tile_duplicated', (data) => {
    socket.broadcast.to(data.room).emit('tileduplicate', { response: data });
  });

  socket.on('tile_clicked', (data) => {
    socket.broadcast.to(data.room).emit('server_response', { response: data });
  });

  socket.on('finished_drag', (data) => {
    socket.broadcast.to(data.room).emit('deselect', { response: data });
  });

  socket.on('hoveron', (data) => {
    socket.broadcast.to(data.room).emit('hover_on', { response: data });
  });

  socket.on('hoveroff', (data) => {
    socket.broadcast.to(data.room).emit('hover_off', { response: data });
  });

  socket.on('reset', (data) => {
    socket.broadcast.to(data.room).emit('reset_tiles');
  });

  socket.on('switch', (data) => {
    socket.broadcast.to(data.room).emit('switch_boards');
  });

  socket.on('terminate', (data) => {
    socket.broadcast.emit('terminate_by_teacher');
    io.emit('user disconnected');
  });

  socket.on('clicked', function (data) {
    console.log('this is the tile id', data.id);
    player.play(`${data.id}.mp3`)
    socket.broadcast.to(data.room).emit('clicked', data);
});

});

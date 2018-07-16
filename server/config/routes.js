// //////////////////////////////////////////////////////////////
//  SERVER/CONFIG/ROUTES.JS FILE
// //////////////////////////////////////////////////////////////
// NOTE: "app" express application is passed to the current file
// from the server.js file when the node server starts.

// Require controller.js file and set it to a variable:
// ( Change the "controller" variable name and the controller file name
// within the 'controllers' directory. )
const users = require('../controllers/users.js');
const tiles = require('../controllers/tiles.js');

// Export all routes to server.js:
module.exports = function (app) {
  // Root route - renders index.ejs view (for socket.io example):
  app.get('/', (request, response) => {
    response.render('index', { message: request.flash('error') });
  });

  app.get ('/forgetpw',(request, response) =>{
    response.render('forgetpw', { message: request.flash('error') });
  })

  app.get('/admin/dashboard', (request, response) => {
    if (request.session.user) {
      users.dashboard(request, response);
    } else {
      response.redirect('/');
    }
  });
  // Admin route - renders admin.ejs:
  // app.get('/index', (request, response) => {
  //   response.render('index', { message: request.flash('error') });
  // });

  app.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
  });

  // enter an individual learnup room
  app.get('/room/:id', users.enterRoom);

  app.get('/tiles', tiles.getTiles);

  // Class has ended, render page with message
  app.get('/end', (request, response) => {
    response.render('endOfClass');
  });  

  app.post('/login', users.login);

  // New user post route
  app.post('/new', users.newUser);

  app.post('/edit', users.editUser);

  app.post('/promote/:id', users.promote);

  app.post('/demote/:id', users.demote);

  app.post('/delete/:id', users.delete);

  app.post('/forgetpassword', users.forgetpassword);

  app.get('/reset/:token', users.getUserinforgetpw);

  app.post('/resetpw', users.resetpassword)
};

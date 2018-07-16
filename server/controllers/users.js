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
const bcrypt = require('bcrypt');

// STEP 4 (DB/SCHEMA SETUP): Declare/define controller on model & export to routes.js:
// ////////////////////////////////////////////////////////////////////////////////////////
//  Retrieve a defined schema from mongoose models:
// 'User' variable object comforms to a model_instance retrieved from mongoose models.
const User = mongoose.model('User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secret = 'learnup'; 

module.exports = {
  // EXAMPLE OF A CRUD get REQUEST method:
  // https://www.npmjs.com/package/bcrypt#with-promises
  login(request, response) {
    User.findOne({ email: request.body.email })
      .then((result) => {
        console.log("This is result in login", result);
        bcrypt.compare(request.body.password, result.hash)
          .then((res) => {
            if (res) {
              console.log("went to then in login", res)
              request.session.user = request.body.email;
              response.redirect('/admin/dashboard');
            }
            else {
              console.log('Error received on bcrypt compare, ');
              request.flash('error', 'Incorrect password ');
              response.redirect('/');
            }
          });
      })
      .catch((error) => {
        console.log('Did not find this user email address, ', error);
        request.flash('error', 'Did not find this user email address');
        response.redirect('/');
      });
  },

  dashboard(request, response) {
    User.findOne({ email: request.session.user }).then((user) => {
      User.find()
        .sort({ admin: -1 })
        .then((users) => {
          response.render('dashboard', {
            user,
            users,
            message: request.flash('exists'),
          });
        });
    });
  },
  newUser(request, response) {
    User.findOne({ email: request.session.email }).then(() => {
      User.findOne({ email: request.body.newuseremail }).then((user) => {
        if (!user) {
          const admin = this.getAdminCode(request.body.newuseradmin);
          bcrypt.hash('default', 10).then((newHash) => {
            User.create({
              email: request.body.newuseremail,
              admin,
              hash: newHash,
            }).then((newUser) => {
            newUser.resettoken = jwt.sign({ email: newUser.email }, secret, { expiresIn: '24h' });
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'learnup2017@gmail.com',
                pass: 'Dojo2017'
              }
            });
  
            var content = `
              Hello,<br><br> You have a new account created by the admin of LearnUP team. Please click on this link below to set your password: <br>
              <a href="http://localhost:8000/reset/${newUser.resettoken}">http://localhost:8000/reset/${newUser.resettoken}</a><br><br>
              This link will expire in 24 hours.<br><br>
              
              LearnUP San Jose`
  
            var mailOptions = {
              from: 'learnup2017@gmail.com',
              to: newUser.email,
              subject: 'Your new LearnUP account',
              html: content
            };
  
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            
              request.flash('exists', `Successfully added ${newUser.email}.`);
              response.redirect('admin/dashboard');
            });
          });
        } else {
          request.flash(
            'exists',
            `Could not add user ${user.email}. Username already exists in database.`,
          );
          response.redirect('admin/dashboard');
        }
      });
    });
  },
  editUser(request, response) {
    User.findOne({ email: request.session.user }).then((adminUser) => {
      User.findOne({ email: request.body.edituseremail }).then((updateUser) => {
        if (updateUser) {
          bcrypt.hash(request.body.edituserpassword, 10).then((newHash) => {
            const admin = this.getAdminCode(request.body.edituseradmin);
            if (adminUser.admin > updateUser.admin) {
              updateUser.hash = newHash;
              updateUser.admin = admin;
              updateUser.save().then((user) => {
                request.flash('exists', `Successfully edited account details for ${user.email}.`);
                response.redirect('admin/dashboard');
              });
            } else {
              request.flash(
                'exists',
                'You not have adequate permissions to perform this operation.',
              );
              response.redirect('admin/dashboard');
            }
          });
        } else {
          request.flash('exists', `Could not find user ${request.body.edituseremail}.`);
          response.redirect('admin/dashboard');
        }
      });
    });
  },
  getAdminCode(adminString) {
    let admin;
    switch (adminString) {
      case 'Admin':
        admin = 9;
        break;
      case 'Teacher':
        admin = 8;
        break;
      default:
        admin = 8;
    }

    return admin;
  },
  promote(request, response) {
    this.changeAccessLevel(request, response, 1);
  },
  demote(request, response) {
    this.changeAccessLevel(request, response, -1);
  },
  changeAccessLevel(request, response, type) {
    User.findOne({ email: request.session.user }).then((adminUser) => {
      User.findOne({ _id: request.params.id }).then((user) => {
        if (adminUser.admin > user.admin) {
          user.admin += type;
          user.save().then((savedUser) => {
            const promotion = type < 0 ? 'demoted' : 'promoted';
            request.flash('exists', `Successfully ${promotion} ${savedUser.email}.`);
            response.redirect('/admin/dashboard');
          });
        } else {
          response.redirect('/admin/dashboard');
        }
      });
    });
  },
  delete(request, response) {
    User.findOne({ email: request.session.user }).then((adminUser) => {
      User.findOne({ _id: request.params.id }).then((user) => {
        if (adminUser.admin > user.admin) {
          User.remove({ _id: user.id })
            .then(() => {
              request.flash('exists', `Successfully deleted ${user.email}.`);
              response.redirect('/admin/dashboard');
            })
            .catch(error => console.log(error));
        } else {
          response.redirect('/admin/dashboard');
        }
      });
    });
  },
  enterRoom(request, response) {
    User.findOne({ _id: request.params.id })
      .then((user) => {
        if (user) {
          var isadmin;
          if (request.session.user) {
            isadmin = true;
          }
          else {
            isadmin = false;
          }
          // var tiles = require('../../static/tilesSideOne.json');
          response.render('board', {
            id: user._id,
            admin: isadmin,
            // prefixes: tiles.sidetwo.prefixes,
            // endingsright: tiles.sidetwo.endingsright,
            // endingsbottom: tiles.sidetwo.endingsbottom,
            // roots: tiles.sidetwo.roots,
            // starstop: tiles.sideone.starstop,
            // starsleft: tiles.sideone.starsleft,
            // starsright: tiles.sideone.starsright,
            // starsbottom: tiles.sideone.starsbottom,
            // dipper: tiles.sideone.dipper,
            // crescent: tiles.sideone.crescent,
            // earth: tiles.sideone.earth
          });
        } else {
          response.redirect('/');
        }
      })
      .catch((error) => {
        console.log(error);
        response.redirect('/');
      });
  }, // <--- ADD ADDITIONAL METHODS SEPARATED BY A COMMA ','

  forgetpassword(request, response) {
    User.findOne({ email: request.body.email }, function (err, user) {
      if (err) {
        request.flash(err);
        response.redirect('/forgetpw');
      } else {
        if (!user) {
          request.flash('error', 'E-mail was not found.');
          response.redirect('/forgetpw');
        } else {
          user.resettoken = jwt.sign({ email: user.email }, secret, { expiresIn: '24h' });
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'learnup2017@gmail.com',
              pass: 'Dojo2017'
            }
          });

          var content = `
            Hello,<br><br> You recently request a password rest link. Please click on the link below to reset your password: <br><br>
            <a href="http://localhost:8000/reset/${user.resettoken}">http://localhost:8000/reset/${user.resettoken}</a>
            `

          var mailList = [
            user.email
          ]

          var mailOptions = {
            from: 'learnup2017@gmail.com',
            to: mailList,
            subject: 'Rest Password Link Request',
            html: content
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          request.flash('error', 'Password reset Link has been send to email.');
          response.redirect('/forgetpw');
        }
      }
    })
  },

  getUserinforgetpw(request, response){
    User.findOne({resettoken: request.params.token}, function(err, user){
      if(err){
        console.log(err)
      } else {
        console.log('user',user)
        var token = request.params.token;
        console.log('token', token)
        jwt.verify(token, secret, function(err, decoded){
          console.log('decoded', decoded)
          if(err){
            response.render('pwreset', {success: false, message: 'password link has expired/ You have no premission to enter this page'})
          } else {
            console.log(decoded.email); 
            response.render('pwreset', {success: true, user: decoded.email, message: request.flash('error')});
          }
        })
      }
    })
  },

  resetpassword(request, response){
    User.findOne({ email: request.body.edituseremail })
    .then((updateUser) => {
      if (updateUser) {
        bcrypt.hash(request.body.edituserpassword, 10).then((newHash) => {
          updateUser.hash = newHash;
          if(updateUser.passwordReset == undefined){
            updateUser.passwordReset = 1;
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'learnup2017@gmail.com',
                pass: 'Dojo2017'
              }
            });
  
            var content = ` 
            New user ${updateUser.email} has login and changed the password.
              `

            var mailOptions = {
              from: 'learnup2017@gmail.com',
              to: 'learnup2017@gmail.com',
              subject: 'New User Reset Password',
              html: content
            };
  
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
          updateUser.save().then((user) => {
            request.flash('exists', `Successfully edited account details for ${user.email}.`);
            response.redirect('/');
          });
        });
      } 
      else {
        request.flash('exists', `Could not find user ${request.body.edituseremail}.`);
        response.redirect('admin/dashboard');
      }
    });
  }

};

var LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users.js')


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });


    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      Users.findById(id, function(err, user) {
        done(err, user);
      });
    });



    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    }, function(req, email, password, done) {
    //kalo ada user
      Users.findOne({ 'userEmail' :  email }, function(err, user) {
        if (err){
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        else if(validateEmail(email) == false ){
          return done(null, false, req.flash('signupMessage', 'That email is not valid.'));
        }
        else if(req.body.password  != req.body.confirmPassword){
          return done(null, false, req.flash('signupMessage', 'Password tidak sama'));
        }
        else {
          var newUser = new Users();
          newUser.userEmail = email;
          newUser.encryptedPassword = newUser.generateHash(password);
          newUser.role = req.body.role
          newUser.save(function(err) {
            if (err){
              throw err
            }
            return done(null, newUser);
          });
        }
      });
    }));


    passport.use('local-login', new LocalStrategy({
      usernameField : 'email', // by default, local strategy uses username and password, we will override with email
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) {
      Users.findOne({ 'userEmail' :  email }, function(err, user) {
        if (err){
          return done(err);
        }
        if(user){
          if(user.encryptedPassword == null){
            return done(null, false, req.flash('loginMessage', 'Please check your email to setup your password'));
          } else {
            if (!user.validPassword(password)){
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            req.session.role = user.role
            req.session.email = user.userEmail
            return done(null, user);
          }
        } else {
          if (!user){
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          }
        }
      });
    }));


};

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/users');

/**
 * GET /forgot
 */
exports.forgotGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('forgot.password.ejs',{messages:""});
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.render('forgot.password.ejs',{ messages: req.flash('error'), status: false });
  }

  async.waterfall([
    function(done) {

      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ userEmail: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error',{msg:'The email address ' + req.body.email + ' is not associated with any account.' });
          return res.render('forgot.password.ejs',{ messages: req.flash('error'), status: false });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      //////

      // create reusable transporter object using the default SMTP transport
      var transporter = nodemailer.createTransport('smtps://mapinczero%40gmail.com:mapinczero0@smtp.gmail.com');
      // setup e-mail data with unicode symbols
      var mailOptions = {
          from: '"Map Inc. 👥" <mapinczero@gmail.com>', // sender address
          to: user.userEmail, // list of receivers
          subject: 'reset ✔', // Subject line
          subject: '✔✿✿ Reset your password on Mapinc',
          text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          // html: '<b>Hello world 🐴</b>' // html body
      };

      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An email has been sent to ' + user.userEmail + ' with further instructions.' });
        return res.render('forgot.password.ejs',{ messages: req.flash('info'), status: true });
      });
    }
  ]);
};

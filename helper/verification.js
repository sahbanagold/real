var Transactions = require('../models/transactions')
var Warehouse = require('../models/warehouse')
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var warehouseid = ""
var request = require('request');

exports.verify = function (id,email,req,res) {
  async.waterfall([
    function(done) {

      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Transactions.findOne({ _id: id}, function(err, transaction) {
        if (!transaction) {
          console.log('transactions to be verified not found.' );
          return
        }
        transaction.verificationToken = token;
        transaction.verificationTokenExpires = Date.now() + 3600000; // expire in 1 hour
        transaction.save(function(err) {
          done(err, token, transaction);
          // Transactions.findOne({ _id: id}).populate('userId').exec(function(err, tr) {
          //
          // })
        });
      });
    },
    function(token, transaction, done) {
      //////
      console.log(email,'email send to, n token ', token);
      // create reusable transporter object using the default SMTP transport
      var transporter = nodemailer.createTransport('smtps://supermanrecycle%40gmail.com:supersuperman@smtp.gmail.com');
      // setup e-mail data with unicode symbols
      var mailOptions = {
          from: '"supermanrecycle. 👥" <supermanrecycle@gmail.com>', // sender address
          to: email, // list of receivers
          subject: 'transactions verification ✔', // Subject line
          text: 'You are receiving this email because you (or someone else) have requested transactions.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/api/transactions/verification/' +transaction._id+'/'+ token + '\n\n' +
          'If you did not request this, please ignore this email.\n'
          // html: '<b>Hello world 🐴</b>' // html body
      };

      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An email has been sent to ' + email + ' with further instructions.' })
        request('http://admin.supermanrecycle.com/api/warehouses', function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          var warehouses = JSON.parse(body)
          console.log(transaction,'transaction');
          var warehouse = warehouses.filter(function (userObj) {
            console.log(typeof userObj.userId,userObj.userId,'userId');
            console.log(typeof transaction.userId,transaction.userId);
            return userObj.userId._id == transaction.userId._id
          })
          console.log(warehouse,'check warehouse---------------');
          if(warehouse[0]){
            warehouseid = warehouse[0]._id
            transaction.userId = warehouse[0].userId
            res.json({success: true,message: "success save transactions", data: transaction, warehouseId : warehouseid})
          } else{
            res.json({success: false, message: "something error, no user found"})
          }
        });
        // Warehouse.findOne({userId: transaction.userId},function (err,warehouse) {
        //     warehouseid = warehouse._id
        //     res.json({success: true,message: "success save transactions", data: transaction, warehouseId : warehouseid})
        // })
      })
    }
  ])
}

exports.sendVerificationsMail = function (req,res) {
  async.waterfall([
    function(done) {
      let token = req.params.token
      Transactions.findOne({ verificationToken: token, _id : req.params.id})
        .where('verificationTokenExpires').gt(Date.now())
        .exec(function(err, transaction) {
          if (!transaction) {
            req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          transaction.verification = "Verified"
          transaction.verificationToken = undefined;
          transaction.verificationTokenExpires = undefined;
          transaction.save(function(err) {
            Transactions.findOne({_id : req.params.id}).populate('userId')
              .exec(function(err, tr) {
                console.log(tr,"here new tr was populateed");
              done(err, tr);
            });
          });
        });
    },
    function(Transactions, done) {
      var transporter = nodemailer.createTransport('smtps://supermanrecycle%40gmail.com:supersuperman@smtp.gmail.com');
      var mailOptions = {
        from: 'supermanrecycle@gmail.com',
        to: Transactions.userId.userEmail,
        subject: 'transactions request verification',
        text: 'Hello, ' + Transactions.userId.name + '\n\n'+
        'Your transactions request has been verified.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Your transactions request has been verified.' });
        return res.redirect('/home')
      });
    }
  ])
}

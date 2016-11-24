var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/users');
const path = require('path')
exports.userProfilePost = function(req, res) {
  var item_image
console.log(req.files)
 if (!req.files) {
     res.send('No files were uploaded.');
     return
 }

 item_image = req.files.photo

 var thumbPath = path.join(__dirname,'../public/images/profile/thumbs/')+item_image['name']
 var realpath = path.join(__dirname,'../public/images/profile/')+req.session.userId+item_image['name']
 console.log(item_image)
 item_image.mv(realpath, function(err) {
     if (err) {
         return res.status(500).send(err);
     }
     User.find({_id: req.session.userId},(err,user) => {
       user[0].profilePicture = 'http://'+req.headers.host+'/images/profile/'+req.session.userId+item_image['name']
       user[0].save(function (err) {
         if (err){
           console.log(err)
           return res.json({success: false,message: "user not found"})
         }
         res.json({success: true,message: "user has been deactivated", data: user[0]})
     })
   })
 })
}
exports.allUserGet = function(req, res) {
  // if(req.session.role && req.session.role.indexOf(1) >= 0){
  //   User.find({},function (err,data) {
  //     if(err){
  //       console.log(err)
  //       return res.json({success: false, message: "something error, no user found"})
  //     }
  //     res.json({success: true, data: data})
  //   })
  // } else {
  //   return res.json({success: false, message: "get out from this, mfucker... U R not authorized"})
  // }
  User.find({},function (err,data) {
    if(err){
      console.log(err)
      return res.json({success: false, message: "something error, no user found"})
    }
    res.json({success: true, data: data})
  })
}
exports.findName = function(req, res) {
  User.find({"name": {'$regex': req.body.name}},function (err,data) {
    if(err){
      console.log(err)
      return res.json({success: false, message: "something error, no user found"})
    }
    res.json({success: true, message: "user has been deactivated", data: data})
  })
}
exports.userGet = function(req, res) {
  User.find({_id: req.params.id},function (err,user) {
    if(err){
      console.log(err)
      return res.json({success: false, message: "user not found"})
    }
    res.json({success: true, data: data})
  })
}
exports.userRegisterPost = function(req, res, next) {
  let newUser = new User()
  newUser.name = req.body.name
  newUser.userEmail = req.body.email
  newUser.role = [1]
  newUser.encryptedPassword = newUser.generateHash(req.body.password)
  newUser.isActive = 'Active'
  newUser.save(function (err) {
    if(err){
      console.log("error creating new user with error: ",err)
      return res.json({success: false, message: "save new user failed"})
    }
    res.json({success: true, message: "new user success saved"})
  })
}



exports.deactivateUserPost = function(req,res,next){
    User.find({_id: req.params.id},(err,user) => {
      console.log(user);
      user[0].isActive = "NonActive"
      user[0].save(function (err) {
        if (err){
          console.log(err)
          return res.json({success: false,message: "user not found"})
        }
        res.json({success: true,message: "user has been deactivated", data: user})
    })
  })
}


exports.activateUserPost = function(req, res) {
  User.find({_id: req.params.id},function (err,user) {
    if(err){
      console.log(err)
      return res.json({success: false, message: "user not found"})
    }
    user[0].isActive = "Active"
    user[0].save(function (err) {
      if (err){
        console.log(err)
      }
      res.json({success: true, message: "user has been activated"})
  })
  })
}

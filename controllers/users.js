var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/users');


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
  newUser.aktif = true
  newUser.save(function (err) {
    if(err){
      console.log("error creating new user with error: ",err)
      return res.json({success: false, message: "save new user failed"})
    }
    res.json({success: true, message: "new user success saved"})
  })
}
exports.deactivateUserPost = function(req, res) {
  User.find({_id: req.params.id},function (err,user) {
    if(err){
      console.log(err)
      return res.json({success: false, message: "user not found"})
    }
    user.aktif = false
    res.json({success: true, message: "user has been deactivated"})
  })
}
exports.activateUserPost = function(req, res) {
  User.find({_id: req.params.id},function (err,user) {
    if(err){
      console.log(err)
      return res.json({success: false, message: "user not found"})
    }
    user.aktif = true
    res.json({success: true, message: "user has been activated"})
  })
}

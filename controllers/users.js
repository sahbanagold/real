var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/users');
const im = require('imagemagick')
exports.userProfilePost = function(req, res) {
  var item_image;

 if (!req.files) {
     res.send('No files were uploaded.');
     return;
 }
console.log(req.files);
 item_image = req.files.files

 var thumbPath = path.join(__dirname,'../public/images/profile/thumbs/')+item_image['name']
 var realpath = path.join(__dirname,'../public/images/profile/')+item_image['name']
 console.log(item_image);
 item_image.mv(realpath, function(err) {
     if (err) {
         res.status(500).send(err);
     }
     else {
       im.resize({
                 srcPath: realpath,
                 dstPath: thumbPath,
                 width:   200
               }, function(err, stdout, stderr){
                 if (err) throw err;
                 console.log('resized image to fit within 200x200px');
               });
var respond = {"files": [
  {
    "name": item_image['name'],
    "size": 902604,
    "url": `http:\/\/${req.headers.host}\/images\/profile\/` + item_image['name'],
    "thumbnailUrl": `http:\/\/${req.headers.host}\/images\/profile\/thumbs\/` + item_image['name'],
    "deleteUrl": `http:\/\/${req.headers.host}\/photos\/`+ item_image['name'],
    "deleteType": "DELETE"
  }
]}
         //res.send({'success':true, 'message':'photo berhasil diupload'});
         res.send(respond);
     }
 });
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

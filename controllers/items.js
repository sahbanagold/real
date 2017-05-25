var Items = require('../models/items');
var request = require('request');

exports.itemGet = function(req, res) {
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/');
  // }
  if(req.session.role){
    request('http://admin.supermanrecycle.com/api/materials', function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      var items = JSON.parse(body)
      if(items[0]){
        console.log(items);
        res.json({success: true, data: items})
      } else{
        res.json({success: false, message: "something error, no user found"})
      }
    });

  // Items.find({},function (err,data) {
  //   if(err){
  //     console.log(err)
  //     return res.json({success: false, message: "something error, no user found"})
  //   }
  //   res.json({success: true, data: data})
  // })
  } else {
    return res.json({success: false, message: "get out from this, mfucker... U R not authorized"})
  }
}


exports.itemPost = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  if(req.session.role && req.session.role.indexOf(0) >= 0){
    let newItem = new Items()
    newItem.name = req.body.name
    newItem.save(function (err) {
      if(err){
        console.log("error creating new item with error: ",err)
        return res.json({success: false, message: "save new item failed"})
      }
      res.json({success: true, message: "new user success saved", data: newItem})
    })
  } else {
    return res.json({success: false, message: "get out from this, mfucker... U R not authorized"})
  }
}

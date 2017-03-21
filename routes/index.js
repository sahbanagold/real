var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var request = require('request');
var cert = "supermantimeline";
var users = require('../models/users')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.flash('loginMessage'))
  res.render('index', { title: 'Superman ', message: req.flash('loginMessage') });
});

router.get('/home', function(req, res, next) {
  if(req.query.token){
    var payload = jwt.verify(req.query.token,cert)
    if(payload.userId){
      req.session.role = payload.role
      req.session.userId = payload.userId
      req.session.email = payload.email
      req.session.profilePict = payload.profilePict
      req.session.name = payload.name
      req.session.passport = payload.passport
      res.redirect('/home')
    }else{
      res.json({success:false,msg:"error token"})
    }
  }else if(req.session.role && (req.session.role.indexOf(1) >= 0||req.session.role.indexOf(2) >= 0)){
    console.log(req.flash('loginMessage'));
    res.render('home', { title: 'Superman ',profilepict:req.session.profilePict, name: req.session.name, message: req.flash('loginMessage')})
    console.log(req.session.profilePict,"profilepict")
  }else {
    res.redirect('/')
  }
})

router.get('/cms-transaction', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(1) >= 0){
  res.render('cms-dashboard.transaction.ejs', { title: 'Superman - Dashboard ',profilepict:req.session.profilePict, name: req.session.name });
} else {
  res.redirect('/')
}
});

router.get('/cms-user', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(1) >= 0){
  res.render('cms-dashboard.user.ejs', { title: 'Superman - Dashboard',profilepict:req.session.profilePict, name: req.session.name });
} else {
  res.redirect('/')
}
});


router.get('/cms-gudang', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(1) >= 0){
  res.render('cms-dashboard.gudang.ejs', { title: 'Superman - Dashboard ',profilepict:req.session.profilePict, name: req.session.name });
} else {
  res.redirect('/')
}
});


router.get('/cms-item', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(1) >= 0){
  res.render('cms-dashboard.item.ejs', { title: 'Superman - Dashboard ',profilepict:req.session.profilePict, name: req.session.name });
} else {
  res.redirect('/')
}
});

router.get('/timeline', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(1) >= 0){
    console.log(req.flash('loginMessage'));
    res.render('home', { title: 'Superman ',profilepict:req.session.profilePict, name: req.session.name, message: req.flash('loginMessage')})
    console.log(req.session.profilePict,"profilepict")
  } else {
    res.redirect('/')
  }
})

/* GET timeline page. */
router.get('/dashboard', function(req, res, next) {
  var jwtToken = jwt.sign(req.session, cert)
  request.post('http://admin.supermanrecycle.com/checkSession',{form:{payload:jwtToken}},function (err,response,body) {
    if(!err){
      res.json({token:`${jwtToken}`})
    }
    else{
      res.json(err)
    }
  })
})

router.post('/checkSession', function(req, res, next) {
  var payload = jwt.verify(req.body.payload,cert)
  if(payload.userId) {
    users
    .findOne({_id:payload.userId})
    .then(user=>{
      if(user) {
        res.json({success:true, msg:"token verified"})
      } else{
          res.json({success:false, msg:"unknown token"})
      }
    })
  } else{
    res.json({success:false, msg:"unknown token"})
  }
})

router.post('/', function(req, res, next) {
  console.log(req.body, "form")
  res.send({ success: true });
});
module.exports = router;

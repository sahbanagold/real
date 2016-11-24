var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Superman ' });
});

router.get('/home', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(1) >= 0){
  res.render('home', { title: 'Superman ',profilepict:req.session.profilePicture, name: req.session.name });
} else {
  res.redirect('/')
}
});

router.get('/cms-transaction', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(0) >= 0){
  res.render('cms-dashboard.transaction.ejs', { title: 'Superman - Dashboard ' });
} else {
  res.redirect('/')
}
});

router.get('/cms-user', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(0) >= 0){
  res.render('cms-dashboard.user.ejs', { title: 'Superman - Dashboard ' });
} else {
  res.redirect('/')
}
});


router.get('/cms-gudang', function(req, res, next) {
  if(req.session.role && req.session.role.indexOf(0) >= 0){
  res.render('cms-dashboard.gudang.ejs', { title: 'Superman - Dashboard ' });
} else {
  res.redirect('/')
}
});


router.post('/', function(req, res, next) {
  console.log(req.body, "form")
  res.send({ success: true });
});
module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Superman ' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Superman ',profilepict:req.session.profilePicture, name: req.session.name });
});

router.get('/cms-transaction', function(req, res, next) {
  res.render('cms-dashboard.transaction.ejs', { title: 'Superman - Dashboard ' });
});

router.get('/cms-user', function(req, res, next) {
  res.render('cms-dashboard.user.ejs', { title: 'Superman - Dashboard ' });
});


router.get('/cms-gudang', function(req, res, next) {
  res.render('cms-dashboard.gudang.ejs', { title: 'Superman - Dashboard ' });
});


router.post('/', function(req, res, next) {
  console.log(req.body, "form")
  res.send({ success: true });
});
module.exports = router;

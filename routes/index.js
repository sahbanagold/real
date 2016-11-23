var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Superman ' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Superman ' });
});

router.get('/cms', function(req, res, next) {
  res.render('cms-dashboard', { title: 'Superman - Dashboard ' });
});


router.post('/', function(req, res, next) {
  console.log(req.body, "form")
  res.send({ success: true });
});
module.exports = router;

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3030
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes')
const users = require('./routes/users')
const items = require('./routes/items')
const seeds = require('./routes/seedings')
const warehouse = require('./routes/warehouse')
const messages = require('./routes/messages')

const transactions = require('./routes/transactions')
const fileUpload = require('express-fileupload')

const expressValidator = require('express-validator')


var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
require('./config/passport')(passport)
app.set('view engine', 'ejs');
app.use(cors())
app.use(morgan('dev'))

app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cookieParser());
app.use(require('express-session')({
    secret: 'supermanbatman',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator())
app.use(flash());

app.use('/', express.static(path.join(__dirname, 'public')))

mongoose.Promise = global.Promise;
app.use(fileUpload())
mongoose.connect('mongodb://localhost:27017/supermanapp') // ganti DB

app.use('/', routes)

app.use('/api/users', users);
app.use('/api/items', items);
app.use('/api/seedings', seeds);
app.use('/api/warehouse', warehouse);
app.use('/api/messages', messages);

app.use('/api/transactions', transactions);
app.get('/logout', function(req, res) {
  console.log(req.session, 'inin session')
  req.logout()
  req.session.destroy()
  res.redirect('/')
  })
app.get('*', function(req, res){
  let img = Math.ceil((Math.random()*3))
      res.render('404.ejs', {url: req.url,imagesrc:`/images/${img}.jpg`})
});

app.listen(port)
console.log('serving on port : ', port)

module.exports = app;

var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var flash    = require('connect-flash');
var argv = require('optimist').argv
var app = express()
var cors = require('cors')
var routes = require('./../routes/index')
var news = require('./../routes/news')
var activity = require('./../routes/activity')
var gift = require('./../routes/gift')
var event = require('./../routes/event')
var images = require('./../routes/images')
var location = require('./../routes/location')
var feedback = require('./../routes/feedback')
let path = require('path')

app.use(session({
  secret: 'hcmc-student',
  saveUninitialized: true,
  resave: true
}));

var conf = {
  port: process.env.PORT || 9000
}

app.set('port', conf.port)
app.use(cors())

app.use('/public', express.static(path.join(__dirname, './../public/')))
app.use('/uploads', express.static(path.join(__dirname, './../uploads/')))
app.set('views', path.join(__dirname, './../views'))
app.set('view engine', 'ejs')

app.use(flash());
app.use(cookieParser())
app.use(express.query())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use('/', routes)
app.use('/', news)
app.use('/', activity)
app.use('/', gift)
app.use('/', event)
app.use('/', images)
app.use('/', location)
app.use('/', feedback)

module.exports = app

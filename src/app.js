let express = require('express')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let flash    = require('connect-flash');
let argv = require('optimist').argv
let app = express()
let cors = require('cors')
let routes = require('./../routes/index')
let news = require('./../routes/news')
let activity = require('./../routes/activity')
let gift = require('./../routes/gift')
let event = require('./../routes/event')
let images = require('./../routes/images')
let location = require('./../routes/location')
let feedback = require('./../routes/feedback')
let comment = require('./../routes/comment')
let reward = require('./../routes/reward')
let notifications = require('./../routes/notifications')

let path = require('path')

app.use(session({
  secret: 'hcmc-student',
  saveUninitialized: true,
  resave: true
}));

let conf = {
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
app.use('/', comment)
app.use('/', reward)
app.use('/', notifications)

module.exports = app

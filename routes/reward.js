var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment-timezone')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Reward = require('./../models/reward')

var cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: 'hwjtqthls',
  api_key: '174213315926813',
  api_secret: 'QgfzJyPCJBSjdkWqPTuBWeSc3D4'
});

var sess;

router.get('/reward', (req, res) => {
  Reward.find({})
    .sort({ updated_at: -1 })
    .then(data => {
      return res.render('pages_reward/index.ejs', {
        rewards: data
      })
    })
    .catch(err => {
      return res.render('pages_event/index.ejs')
    })
})

router.post('/reward/add', (req, res) => {
  var form = new formidable.IncomingForm()
  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = path.join(__dirname, './../uploads/reward')
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log('Error is: ' + err)
    }
    var imageDir = files.thumbnail.path
    var images = ''
    cloudinary.uploader.upload(imageDir, function (result) {
      let deadline = new Date(fields.deadline)
      images = result.url
      var data = Reward({
        "name": fields.name,
        "thumbnail": images,
        "detail": fields.detail,
        "number": fields.number,
        "deadline": deadline.getTime()
      })
      fs.unlink(imageDir);
      data.save(function (err, news) {
        if (err) {
          return res.render('pages_event/index.ejs')
        }
        return res.redirect('/reward')
      })
    })
  })
})

module.exports = router

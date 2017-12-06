var express = require('express')
var multer = require('multer');
var upload = multer({ dest: 'uploads/reward/' });
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment-timezone')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Reward = require('./../models/reward')

var sess;

var cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: 'hwjtqthls',
  api_key: '174213315926813',
  api_secret: 'QgfzJyPCJBSjdkWqPTuBWeSc3D4'
});

var sess;

router.get('/reward', (req, res) => {
  sess = req.session
  Reward.find({})
    .sort({ updated_at: -1 })
    .then(data => {
      return res.render('pages_reward/index.ejs', {
        rewards: data,
        req: req
      })
    })
    .catch(err => {
      return res.render('pages_event/index.ejs')
    })
})

router.get('/reward/:id', (req, res) => {
  let id = req.params.id
  Reward.findOne({_id: id})
    .then(data => {
      return res.render('pages_reward/detail.ejs', {
        detail: data,
        req: req
      });
    })
    .catch(err => {
      return res.render('pages_event/index.ejs')
    })
})

router.post('/reward/add', upload.single('thumbnail'), (req, res) => {
  let partner = []
  req.body.partner.map(r => {
    partner.push({
      name: r[0],
      address: r[1],
      number: r[2]
    })
  })
  cloudinary.uploader.upload(req.file.path, function (result) {
      let deadline = new Date(req.body.deadline)
      var data = Reward({
        "name": req.body.name,
        "thumbnail": result.url,
        "detail": req.body.detail,
        "point": req.body.point,
        "number": req.body.number,
        "partner": partner,
        "deadline": deadline.getTime()
      })
      fs.unlink(req.file.path);
      data.save(function (err, news) {
        if (err) {
          return res.render('pages_reward/index.ejs')
        }
        return res.redirect('/reward')
      })
  })
})

module.exports = router

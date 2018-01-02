var express = require('express')
var multer = require('multer');
var upload = multer({ dest: 'uploads/reward/' });
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment-timezone')
var router = express.Router()

var Admin = require('./../models/admin')
var Login = require('./../models/login')
var Reward = require('./../models/reward')
var Partner = require('./../models/partner')
var Redeem = require('./../models/redeem')

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
      Admin.find({is_block: false, position: 'partner'})
        .then(admin => {
          let partner = admin;
          console.log(partner)
          return res.render('pages_reward/index.ejs', {
            rewards: data,
            partner: partner,
            req: req
          })
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
  sess = req.session
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
        for (let i = 0; i < partner.length; i++) {
          let partner_info = Partner({
            reward_id: news._id,
            user_id: partner[i].user_id,
            number: partner[i].number
          })

          partner_info.save();
        }
        return res.redirect('/reward')
      })
  })
})

router.get('/reward/:id/redeem', (req, res) => {
  let id = req.params.id;
  Redeem.find({reward_id: id})
    .then(data => {
      Reward.find({_id: id})
        .then(reward => {
          return res.render('pages_reward/redeem.ejs', {
            datas: data,
            reward: reward,
            req: req
          })
        })
        .catch(err => {
            return res.render('pages_event/index.ejs')
        })
    })
    .catch(err => {
        return res.render('pages_event/index.ejs')
    })
})

module.exports = router

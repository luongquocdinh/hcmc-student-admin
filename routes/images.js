var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Images = require('./../models/images')

var cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: 'hwjtqthls', 
  api_key: '174213315926813', 
  api_secret: 'QgfzJyPCJBSjdkWqPTuBWeSc3D4' 
});


var sess;

router.get('/images', (req, res) => {
    sess = req.session
    if (sess.email) {
        Images.find({})
            .sort({updated_at: -1})
            .then(data => {
                return res.render('pages_images/news.ejs', {
                    news: data,
                    req: req
                })
            })
            .catch(err => {
                return res.render('pages_images/index.ejs')
            })
    }
})

router.post('/images/add', (req, res) => {
    sess = req.session
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/images')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var index = 0
        var images = []
        for (var i = 0; i < files.thumbnail.length; i++) {
            var imageDir = files.thumbnail[i].path
            cloudinary.uploader.upload(imageDir, function(result) {
                index++
                images.push(result.url)
                if (index == files.thumbnail.length) {
                    var data = Images({
                        "title": fields.title,
                        "images": images,
                        "is_accept": sess.is_accept,
                    })
                    data.save(function (err, news) {
                        if (err) {
                            return res.render('pages_images/index.ejs')
                        }
                        return res.redirect('/images')
                    })
                }
            })
        }
    })
})

router.get('/images/:id', (req, res) => {
    var id = req.params.id
    Images.findOne({_id: id})
        .then(data => {
            return res.render('pages_images/news_detail.ejs', {
                news: data,
                req, req
            })
        }).catch(err => {
            return res.render('pages_images/index.ejs')
        })
})

module.exports = router
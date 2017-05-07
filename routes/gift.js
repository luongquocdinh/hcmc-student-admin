var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Gift = require('./../models/gift')
var Topic = require('./../models/topic')

var sess;

router.get('/gift', function (req, res) {
    sess = req.session
    if (sess.email) {
        Gift.find({}, function (err, data) {
            if (err) {
                return res.render('pages_gift/index.ejs')
            }
    
            if (data) {
                return res.render('pages_gift/gift.ejs', {
                    gift: data,
                    req: req
                })
            }
        })
    } else {
        return res.redirect('/')
    }
})

router.get('/gift/:id', function (req, res) {
    Gift.findOne({_id: req.params.id})
        .sort({updated_at: -1})
        .then(data => {
            return res.render('pages_gift/topic.ejs', {
                news: data
            })
        })
        .catch(err => {
            return res.render('pages_gift/index.ejs')
        })
})

router.post('/gift/topic/add', function (req, res) {
    var data = Gift({
        topic: req.body.topic,
        is_enable: true,
        news: []
    })

    Gift.findOne({topic: req.body.topic}, function (err, topic) {
        if (err) throw err
        if (!topic) {
            data.save(function (err) {
                if (err) throw err
                Gift.findOne({topic: req.body.topic}, function (err, info) {
                    if (err) throw err
                    if (info) {
                        info_topic = Topic({
                            id_topic: info._id,
                            name_source: 'Hoạt động',
                            name_topic: info.topic
                        })
                        info_topic.save()
                        return res.redirect('/gift')
                    }
                })
            })
        } else {
            return res.redirect('/')
        }
    })
})

router.post('/gift/add/news', function (req, res) {
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/gift')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var imageDir = files.thumbnail.path
        var id = fields._id
        var data = {
            "title": fields.title,
            "thumbnail": imageDir.substring(imageDir.indexOf('/uploads/gift/')),
            "brief": fields.brief,
            "content": fields.content,
        }
        Gift.findOne({_id: id}, function (err, news) {
            if (err) console.log(err)
            if (news) {
                news.news.push(data)
                news.save()
                news.news.sort({updated_at: -1})
                return res.redirect('/gift/' + id)
            } else {
                return res.render('pages_gift/index.ejs')
            }
        })
    })
})

router.get('/gift/:id/:id_gift', function (req, res) {
    Gift.findOne({_id: req.params.id}, function (err, news) {
        if (err) return console.log(err)
        if (news) {
            for (var i = 0; i < news.news.length; i++) {
                if (news.news[i].id === req.params.id_gift) {
                    return res.render('pages_gift/news_detail.ejs', {
                        news: news.news[i]
                    })
                }
            }
        }
    })
})
module.exports = router
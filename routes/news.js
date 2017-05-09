var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var News = require('./../models/news')
var Topic = require('./../models/topic')

var sess;

router.get('/news', function (req, res) {
    sess = req.session
    if (sess.email) {
        News.find({}, function (err, data) {
            if (err) {
                return res.render('pages_news/index.ejs')
            }
    
            if (data) {
                return res.render('pages_news/news.ejs', {
                    news: data,
                    req: req
                })
            }
        })
    } else {
        return res.redirect('/')
    }
})

router.get('/news/:id', function (req, res) {
    News.findOne({_id: req.params.id})
        .sort({updated_at: -1})
        .then(data => {
            return res.render('pages_news/topic.ejs', {
                news: data
            })
        })
        .catch(err => {
            return res.render('pages_news/index.ejs')
        })
})

router.post('/news/topic/add', function (req, res) {
    var data = News({
        topic: req.body.topic,
        is_enable: true,
        news: []
    })

    News.findOne({topic: req.body.topic}, function (err, topic) {
        if (err) throw err
        if (!topic) {
            data.save(function (err) {
                if (err) throw err
                News.findOne({topic: req.body.topic}, function (err, info) {
                    if (err) throw err
                    if (info) {
                        info_topic = Topic({
                            id_topic: info._id,
                            name_source: 'Tin Tức',
                            name_topic: info.topic
                        })
                        info_topic.save()
                        return res.redirect('/news')
                    }
                })
            })
        } else {
            return res.redirect('/')
        }
    })
})

router.post('/add/news', function (req, res) {
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/news')
    console.log(form.uploadDir)
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var imageDir = files.thumbnail.path
        console.log(imageDir)
        var id = fields._id
        var data = {
            "title": fields.title,
            "thumbnail": imageDir.substring(imageDir.indexOf('/uploads/news/')),
            "brief": fields.brief,
            "content": fields.content,
        }
        News.findOne({_id: id}, function (err, news) {
            if (err) console.log(err)
            if (news) {
                news.news.push(data)
                news.save()
                news.news.sort({updated_at: -1})
                return res.redirect('./../news/' + id)
            } else {
                return res.render('pages_news/index.ejs')
            }
        })
    })
})

router.get('/news/:id/:id_news', function (req, res) {
    News.findOne({_id: req.params.id}, function (err, news) {
        if (err) return console.log(err)
        if (news) {
            for (var i = 0; i < news.news.length; i++) {
                if (news.news[i].id === req.params.id_news) {
                    return res.render('pages_news/news_detail.ejs', {
                        news: news.news[i]
                    })
                }
            }
        }
    })
})
module.exports = router
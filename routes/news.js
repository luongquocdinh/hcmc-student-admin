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
                return res.render('pages/index.ejs')
            }
    
            if (data) {
                console.log(data)
                return res.render('pages/news.ejs', {
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
    News.findOne({_id: req.params.id}, function (err, data) {
        if (err) {
            return res.render('pages/index.ejs')
        }

        if (data) {
            return res.render('pages/topic.ejs', {
                news: data
            })
        }
    })
})

router.get('/news/topic/add', function (req, res) {
    res.render('pages/add_topic.ejs')
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
                    console.log('here')
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

router.get('/news/add/news', function (req, res) {
    res.render('pages/add_news.ejs')
})

router.post('/add/news', function (req, res) {
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/news')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var imageDir = files.thumbnail.path
        var id = fields._id
        var data = News({
            "title": fields.title,
            "thumbnail": imageDir.substring(imageDir.indexOf('/uploads/news/')),
            "brief": fields.brief,
            "content": fields.content,
        })
        News.findOne({_id: id}, function (err, news) {
            if (err) console.log(err)
            if (news) {
                news.news.push(data)
                news.save()
                news.news.sort({updated_at: 1})
                return res.redirect('./../news/' + id)
            } else {
                return res.render('pages/index.ejs')
            }
        })
    })
})

router.get('/:id/:id_news', function (req, res) {
    News.findOne({_id: req.params.id}, function (err, news) {
        if (err) return console.log(err)
        if (news) {
            for (var i = 0; i < news.news.length; i++) {
                if (news.news[i].id === req.params.id_news) {
                    return res.render('pages/news_detail.ejs', {
                        news: news.news[i]
                    })
                }
            }
        }
    })
})
module.exports = router
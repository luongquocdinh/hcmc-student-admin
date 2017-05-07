var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Activity = require('./../models/activity')
var Topic = require('./../models/topic')

var sess;

router.get('/activity', function (req, res) {
    sess = req.session
    if (sess.email) {
        Activity.find({}, function (err, data) {
            if (err) {
                return res.render('pages_activity/index.ejs')
            }
    
            if (data) {
                return res.render('pages_activity/activity.ejs', {
                    activity: data,
                    req: req
                })
            }
        })
    } else {
        return res.redirect('/')
    }
})

router.get('/activity/:id', function (req, res) {
    Activity.findOne({_id: req.params.id})
        .sort({updated_at: -1})
        .then(data => {
            return res.render('pages_activity/topic.ejs', {
                news: data
            })
        })
        .catch(err => {
            return res.render('pages_activity/index.ejs')
        })
})

router.post('/activity/topic/add', function (req, res) {
    var data = Activity({
        topic: req.body.topic,
        is_enable: true,
        news: []
    })

    Activity.findOne({topic: req.body.topic}, function (err, topic) {
        if (err) throw err
        if (!topic) {
            data.save(function (err) {
                if (err) throw err
                Activity.findOne({topic: req.body.topic}, function (err, info) {
                    if (err) throw err
                    if (info) {
                        info_topic = Topic({
                            id_topic: info._id,
                            name_source: 'Hoạt động',
                            name_topic: info.topic
                        })
                        info_topic.save()
                        return res.redirect('/activity')
                    }
                })
            })
        } else {
            return res.redirect('/')
        }
    })
})

router.post('/activity/add/news', function (req, res) {
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/activity')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var imageDir = files.thumbnail.path
        var id = fields._id
        var data = {
            "title": fields.title,
            "thumbnail": imageDir.substring(imageDir.indexOf('/uploads/activity/')),
            "brief": fields.brief,
            "content": fields.content,
        }
        Activity.findOne({_id: id}, function (err, news) {
            if (err) console.log(err)
            if (news) {
                news.news.push(data)
                news.save()
                news.news.sort({updated_at: -1})
                return res.redirect('/activity/' + id)
            } else {
                return res.render('pages_activity/index.ejs')
            }
        })
    })
})

router.get('/activity/:id/:id_activity', function (req, res) {
    Activity.findOne({_id: req.params.id}, function (err, news) {
        if (err) return console.log(err)
        if (news) {
            for (var i = 0; i < news.news.length; i++) {
                if (news.news[i].id === req.params.id_activity) {
                    return res.render('pages_activity/news_detail.ejs', {
                        news: news.news[i]
                    })
                }
            }
        }
    })
})
module.exports = router
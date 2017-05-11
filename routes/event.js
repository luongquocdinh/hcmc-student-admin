var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Event = require('./../models/event')

var sess;

router.get('/event', (req, res) => {
    sess = req.session
    if (sess.email) {
        Event.find({})
            .sort({updated_at: -1})
            .then(data => {
                return res.render('pages_event/news.ejs', {
                    news: data,
                    req: req
                })
            })
            .catch(err => {
                return res.render('pages_event/index.ejs')
            })
    }
})

router.post('/event/add', (req, res) => {
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/event')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var imageDir = files.thumbnail.path
        var data = Event({
            "title": fields.title,
            "thumbnail": imageDir.substring(imageDir.indexOf('/uploads/event/')),
            "brief": fields.brief,
            "content": fields.content,
            "is_accept": false,
        })
        data.save(function (err, news) {
            if (err) {
                return res.render('pages_event/index.ejs')
            }
            return res.redirect('/event')
        })
    })
})

router.get('/event/:id', (req, res) => {
    var id = req.params.id
    Event.findOne({_id: id})
        .then(data => {
            return res.render('pages_event/news_detail.ejs', {
                news: data
            })
        })
        .catch(err => {
            return res.render('pages_event/index.ejs')
        })
})

module.exports = router
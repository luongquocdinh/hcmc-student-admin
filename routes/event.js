var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment-timezone')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Event = require('./../models/event')
var EventRegister = require('./../models/event_register');

const ZONE = 25200000

var cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: 'hwjtqthls', 
  api_key: '174213315926813', 
  api_secret: 'QgfzJyPCJBSjdkWqPTuBWeSc3D4' 
});

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
    sess = req.session
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/event')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        var imageDir = files.thumbnail.path
        var images = ''
        let start =  Date.parse(fields.startDate) - ZONE
        let end =  Date.parse(fields.endDate) - ZONE
        let deadline =  Date.parse(fields.deadline) - ZONE
        console.log(start, " - ", end,  " - ", deadline);
        cloudinary.uploader.upload(imageDir, function(result) {
            images = result.url
            var data = Event({
                "title": fields.title,
                "thumbnail": images,
                "brief": fields.brief,
                "startDate":start,
                "endDate": end,
                "content": fields.content,
                "number": fields.number,
                "address": fields.address,
                "deadline": deadline,
                "is_accept": sess.is_accept,
            })
            fs.unlink(imageDir);
            data.save(function (err, news) {
                if (err) {
                    return res.render('pages_event/index.ejs')
                }
                return res.redirect('/event')
            })
        })
    })
})

router.get('/event/:id', (req, res) => {
    var id = req.params.id
    Event.findOne({_id: id})
        .then(data => {
            let start = moment(data.startDate).format('YYYY-MM-DDTHH:mm');
            let end = moment(data.endDate).format('YYYY-MM-DDTHH:mm');
            let deadline = moment(data.deadline).format('YYYY-MM-DDTHH:mm');
            return res.render('pages_event/news_detail.ejs', {
                news: data,
                start: start,
                end: end,
                deadline: deadline
            })
        })
        .catch(err => {
            return res.render('pages_event/index.ejs')
        })
})

router.post('/event/:id/update', (req, res) => {
    sess = req.session
    let thumbnail = ''
    let dirImage = ''
    let id = req.params.id
    var form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/event')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        Event.findOne({_id: id})
            .then(event => {
                 if (files.thumbnail.size != 0) {
                    thumbnail = files.thumbnail.path
                    cloudinary.uploader.upload(thumbnail, function(result) {
                        dirImage = result.url
                        if (fields.is_accept == 'on') {
                            fields.is_accept = true
                        } else {
                            fields.is_accept = false
                        }
        
                        event.title = fields.title
                        event.thumbnail = fields.thumbnail
                        event.brief = fields.brief
                        event.is_accept = fields.is_accept
                        event.content = fields.content
                        event.number = fields.number
                        event.address = fields.address
                        event.startDate = Date.parse(fields.startDate) - ZONE
                        event.endDate = Date.parse(fields.endDate) - ZONE
                        event.deadline = Date.parse(fields.deadline) - ZONE
                        event.save()
                    })
                } else {
                    dirImage = event.thumbnail
                    if (fields.is_accept == 'on') {
                    fields.is_accept = true
                    } else {
                        fields.is_accept = false
                    }
    
                    event.title = fields.title
                    event.thumbnail = dirImage
                    event.brief = fields.brief
                    event.is_accept = fields.is_accept
                    event.content = fields.content
                    event.number = fields.number
                    event.address = fields.address
                    event.startDate = Date.parse(fields.startDate) - ZONE
                    event.endDate = Date.parse(fields.endDate) - ZONE
                    event.deadline = Date.parse(fields.deadline) - ZONE
                    event.save()
                }

                return res.redirect('/event')
            }).catch(err => {
                return res.render('pages_event/index.ejs')
            })
    })
})

router.get('/event/:id/register', (req, res) => {
    let id = req.params.id;
    EventRegister.find({event_id: id})
        .then(data => {
            Event.findOne({_id: id})
                .then(event => {
                    return res.render('pages_event/register.ejs', {
                        datas: data,
                        event: event
                    });
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
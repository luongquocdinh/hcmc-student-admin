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
        cloudinary.uploader.upload(imageDir, function(result) {
            let start = new Date(fields.startDate)
            let end = new Date(fields.endDate)
            let deadline = new Date(fields.deadline)
            images = result.url
            var data = Event({
                "title": fields.title,
                "thumbnail": images,
                "brief": fields.brief,
                "startDate":start.getTime(),
                "endDate": end.getTime(),
                "content": fields.content,
                "number": fields.number,
                "address": fields.address,
                "deadline": deadline.getTime(),
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
            let start = moment.utc(data.startDate).format('YYYY-MM-DDThh:mm');
            let end = moment.utc(data.endDate).format('YYYY-MM-DDThh:mm');
            let deadline = moment.utc(data.deadline).format('YYYY-MM-DDThh:mm');
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
                        console.log(dirImage)
                        if (fields.is_accept == 'on') {
                            fields.is_accept = true
                        } else {
                            fields.is_accept = false
                        }
        
                        var data = {
                            "title": fields.title,
                            "thumbnail": dirImage,
                            "brief": fields.brief,
                            "is_accept": fields.is_accept,
                            "content": fields.content,
                            "startDate": fields.startDate,
                            "endDate": fields.endDate
                        }
                        event.title = data.title
                        event.thumbnail = data.thumbnail
                        event.brief = data.brief
                        event.is_accept = data.is_accept
                        event.content = data.content
                        event.startDate = data.startDate
                        event.endDate = data.endDate
                        console.log(event)
                        event.save()
                    })
                } else {
                    dirImage = event.thumbnail
                    if (fields.is_accept == 'on') {
                    fields.is_accept = true
                    } else {
                        fields.is_accept = false
                    }
    
                    var data = {
                        "title": fields.title,
                        "thumbnail": dirImage,
                        "brief": fields.brief,
                        "is_accept": fields.is_accept,
                        "content": fields.content,
                        "startDate": fields.startDate,
                        "endDate": fields.endDate
                    }
                    event.title = data.title
                    event.thumbnail = data.thumbnail
                    event.brief = data.brief
                    event.is_accept = data.is_accept
                    event.content = data.content
                    event.startDate = data.startDate
                    event.endDate = data.endDate
                    event.save()
                }

                return res.redirect('/event')
            }).catch(err => {
                return res.render('pages_event/index.ejs')
            })
    })
})
module.exports = router
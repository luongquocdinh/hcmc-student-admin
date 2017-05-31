var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment')
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
            images = result.url
            var data = Event({
                "title": fields.title,
                "thumbnail": images,
                "brief": fields.brief,
                "startDate": fields.startDate,
                "endDate": fields.endDate,
                "content": fields.content,
                "is_accept": sess.is_accept,
            })
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
            let dateStart = new Date(data.startDate)
            let dateEnd = new Date(data.endDate)
            mmStart = dateStart.getMonth() + 1
            mmEnd = dateEnd.getMonth() + 1
            let monthStart = ''
            let monthEnd = ''
            let dayStart = ''
            let dayEnd = ''
            if (dateStart.getMonth() >= 9) {
                monthStart = mmStart
            } else {
                monthStart = '0' + mmStart
            }

            if (dateEnd.getMonth() >= 9) {
                monthEnd = mmEnd
            } else {
                monthEnd = '0' + mmEnd
            }

            if (dateStart.getDate() < 10) {
                dayStart = '0' + dateStart.getDate()
            } else {
                dayStart = dateStart.getDate()
            }

            if (dateEnd.getDate() < 10) {
                dayEnd = '0' + dateEnd.getDate()
            } else {
                dayEnd = dateEnd.getDate()
            }

            let start = dateStart.getFullYear() + '-' + monthStart + '-' + dayStart
            let end = dateEnd.getFullYear() + '-' + monthEnd + '-' + dayEnd
            return res.render('pages_event/news_detail.ejs', {
                news: data,
                start: start,
                end: end
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
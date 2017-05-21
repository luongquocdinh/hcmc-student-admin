var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var router = express.Router()

var FeedBack = require('./../models/feedback')

var sess;

router.get('/feedback', function (req, res) {
    FeedBack.find({}, function (err, feedback) {
        if (err) {
            return console.log(err)
        }
        return res.render('pages_feedback/news.ejs', {
            news: feedback
        })
    })
})

router.get('/feedback/:id', function (req, res) {
    FeedBack.findOne({_id: req.params.id}, function (err, feedback) {
        if (err) {
            return console.log(err)
        }
        return res.render('pages_feedback/news_detail.ejs', {
            news: feedback
        })
    })
})

module.exports = router
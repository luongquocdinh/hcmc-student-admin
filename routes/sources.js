var express = require('express')
var chrono = require('chrono-node');
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Sources = require('./../models/sources')
let News = require('./../models/news')
var sess;
router.get('/sources', (req, res) => {
    sess = req.session
    Sources.find({})
        .then(data => {
            res.render('pages_sources/index.ejs', {
                'datas': data,
                req: req
            });
        })
        .catch(err => {
            return res.render('pages_event/index.ejs');
        })
})

router.get('/sources/:id', (req, res) => {
    let id = req.params.id
    Sources.findOne({_id: id})
        .then(data => {
            res.render('pages_sources/detail.ejs', {
                'detail': data,
                req: req
            });
        })
        .catch(err => {
            return res.render('pages_event/index.ejs');
        })
})

router.post('/sources/addData', (req, res) => {
    let title = req.body.crawled_title;
    let brief = req.body.crawled_brief;
    let datetime = req.body.crawled_datetime;
    let thumbnail = req.body.crawled_thumbnail;
    let content = req.body.crawled_detail;
    let author = req.body.crawled_author;

    let data = News({
        title: title,
        brief: brief,
        datetime: chrono.parseDate(datetime).getTime() || Date.now(),
        thumbnail: thumbnail,
        content: content,
        author: author,
        is_accept: true,
        
        topic: "Tin Tức Tổng Hợp",
        topic_ascii: "tin-tuc-tong-hop",
        source: "news"
    });

    data.save(() => {
        return res.redirect('/sources/' + req.body.source_id);
    })
})

module.exports = router
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
                detail: data,
                req: req,
                action: '/sources/'+ id +'/parser/update'
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
    let article = req.body.crawled_article;

    let data = News({
        title: title,
        brief: brief,
        datetime: Date.now(),
        thumbnail: thumbnail,
        content: content + '<p><strong>' + article + '</strong></p>',
        author: author,
        is_accept: true,

        article: article,
        
        topic: "Tin Tức Tổng Hợp",
        topic_ascii: "tin-tuc-tong-hop",
        source: "news"
    });

    data.save(() => {
        return res.redirect('/sources/' + req.body.source_id);
    })
})

router.get('/sources/add/parser', (req, res) => {
    return res.render('pages_sources/add.ejs', {
        req: req,
        action: '/sources/parser/save'
    });
})

router.post('/sources/parser/save', (req, res) => {
    let name = req.body.name;
    let origin_url = req.body.origin_url;
    let url = req.body.url;
    let detail = {
        title: req.body.title,
        datetime: req.body.datetime,
        brief: req.body.brief,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        author: req.body.author
    };
    let link = req.body.link;

    let data = Sources({
        name: name,
        origin_url: origin_url,
        url: url,
        crawler: {
            link: link,
            detail: detail
        }
    })

    data.save(() => {
        return res.redirect('/sources');
    })
})

router.post('/sources/:id/parser/update', (req, res) => {
    let id = req.params.id;
    let detail = {
        title: req.body.title,
        datetime: req.body.datetime,
        brief: req.body.brief,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        author: req.body.author
    };
    
    Sources.findOne({_id: id})
        .then(data => {
            data.crawler.detail = detail
            data.save(() => {
                return res.redirect('/sources/' + id);
            })
        })
})

module.exports = router
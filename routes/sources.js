var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var fs = require('fs')
var moment = require('moment')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var Sources = require('./../models/sources')
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

module.exports = router
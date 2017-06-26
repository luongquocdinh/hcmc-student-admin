let express = require('express')
let path = require('path')
let formidable = require('formidable')
let session = require('express-session')
let fs = require('fs')
let router = express.Router()

let Login = require('./../models/login')
let News = require('./../models/news')
let Topic = require('./../models/topic')

let cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: 'hwjtqthls', 
  api_key: '174213315926813', 
  api_secret: 'QgfzJyPCJBSjdkWqPTuBWeSc3D4' 
});


let sess;

function convertToASCII(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    return str;
}

router.get('/activity', function (req, res) {
    sess = req.session
    if (sess.email) {
        Topic.find({source: 'activity'})
            .then(data => {
                return res.render('pages_activity/news.ejs', {
                    topic: data,
                    req: req
                })
            }).catch(err => {
                return res.render('pages_activity/index.ejs');
            })
    } else {
        return res.redirect('/')
    }
})

router.get('/activity/:topic_ascii', function (req, res) {
    let topic_ascii = req.params.topic_ascii
    Topic.findOne({topic_ascii: topic_ascii})
        .then(topic => {
            News.find({topic_ascii: topic_ascii})
            .sort({updated_at: -1})
            .then(data => {
                return res.render('pages_activity/topic.ejs', {
                    news: data,
                    topic_ascii: topic_ascii,
                    topic: topic.topic
                })
            })
            .catch(err => {
                return res.render('pages_activity/index.ejs')
            })
        })
})

router.post('/activity/topic/add', function (req, res) {
    let topic = req.body.topic
    let topic_ascii = convertToASCII(topic)
    let info_topic = Topic({
        topic: topic,
        source: 'activity',
        topic_ascii: topic_ascii
    })
    info_topic.save()
    return res.redirect('/activity')    
})

router.post('/activity/add/news', function (req, res) {
    let form = new formidable.IncomingForm()

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname + './../uploads/activity')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        let imageDir = files.thumbnail.path
        let topic_ascii = fields.topic_ascii
        let images = ''
        cloudinary.uploader.upload(imageDir, function(result) {
            images = result.url
            let data = News({
                "title": fields.title,
                "source": 'activity',
                "topic": fields.topic,
                "topic_ascii": fields.topic_ascii,
                "datetime": Math.floor(Date.now() / 1000),
                "thumbnail": images,
                "brief": fields.brief,
                "is_accept": sess.is_accept,
                "content": fields.content,
                "author": fields.author
            })
            
            data.save(function (err) {
                if (err) {
                    return res.render('pages_activity/index.ejs');
                }

                return res.redirect('/activity/' + topic_ascii);
            }) 
        });
    })
})

router.get('/activity/:topic_ascii/:id', function (req, res) {
    let id = req.params.id

    News.findOne({_id: id})
        .then(data => {
            return res.render('pages_activity/news_detail.ejs', {
                news: data
            });
        }).catch(err => {
            return res.render('pages_activity/index.ejs');
        })
})

router.post('/activity/update/:topic_ascii/:id', function (req, res) {
    let form = new formidable.IncomingForm()
    let thumbnail = ''
    let dirImage = ''

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, './../uploads/activity')
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error is: ' + err)
        }
        let topic_ascii = req.params.topic_ascii
        let id = req.params.id
        News.findOne({_id: id}) 
            .then(news => {
                if (err) console.log(err)
                
                if (files.thumbnail.size != 0) {
                    thumbnail = files.thumbnail.path
                    cloudinary.uploader.upload(thumbnail, function(result) {
                        dirImage = result.url
                        if (fields.is_accept == 'on') {
                            fields.is_accept = true
                        } else {
                            fields.is_accept = false
                        }
                    
                        news.title = fields.title
                        news.thumbnail = dirImage
                        news.brief = fields.brief
                        news.content = fields.content
                        news.is_accept = fields.is_accept
                        news.datetime = Math.floor(Date.now() / 1000)
                        news.author = fields.author
                        news.save() 
                    })
                } else {
                    if (fields.is_accept == 'on') {
                        fields.is_accept = true
                    } else {
                        fields.is_accept = false
                    }
                    news.title = fields.title
                    news.brief = fields.brief
                    news.content = fields.content
                    news.is_accept = fields.is_accept
                    news.datetime = Math.floor(Date.now() / 1000)
                    news.author = fields.author
                    news.save() 
                }
                
                return res.redirect('./../../../activity/' + topic_ascii)
        }).catch(err => {
            return res.render('pages_activity/index.ejs');
        })
    })
})
module.exports = router
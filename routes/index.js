var express = require('express')
var path = require('path')
var formidable = require('formidable')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var fs = require('fs')
var crypto = require('crypto')
var randomString = require('randomstring')
var nodemailer = require('nodemailer')
var router = express.Router()

var User = require('./../models/user')
var Login = require('./../models/login')
var News = require('./../models/news')
var Admin = require('./../models/admin')
var Topic = require('./../models/topic')
var School = require('./../models/school')

var sess;

router.get('/', function (req, res) {
    sess = req.session
    if (sess.email) {
        res.redirect('/news')
    } else {
        res.render('user/login.ejs')
    }
})

router.get('/login', function (req, res) {
    res.render('user/login.ejs')
})

router.post('/login', function (req, res) {
    sess = req.session;
    sess.email = req.body.email;
    var email = req.body.email
    var password = crypto.createHash("sha256").update(req.body.password).digest('base64')
    let secretKey = randomString.generate()
    Admin.findOne({ email: email, password: password, is_block: false }, function (err, user) {
        if (!user) {
            req.flash("msg","Login fields");
            res.locals.messages = req.flash();
            return res.render('user/login.ejs')
        } else {
            sess.position = user.position
            sess.school = user.school
            var data = Login({
                "token": crypto.createHmac('sha256', secretKey).update(user.email).digest('hex'),
                "email": user.email,
                "is_active": true,
                "created_at" : new Date(),
                "updated_at" : new Date()
            })
            data.save(function (err) {
                if (err) {
                    return console.log(err)
                }
                sess.token = data.token
                sess.position = user.position
                console.log(req.session)
                return res.redirect('/news')
            })
        }
    })
})

router.get('/logout', function (req, res) {
    req.session.destroy( function (err) {
		if(err) {
			console.log(err);
		}
		else {
			res.redirect('/');
		}
	})
})

router.get('/list_user', function (req, res) {
    Admin.find({}, function (err, data) {
        if (err) {
            console.log(err)
        }

        if (data) {
            // console.log(req.session)
            Topic.find({}, function (err, topic) {
                if (err) {
                    console.log(err)
                }
                if (topic) {
                    return res.render('pages/list_user', {
                        user: data,
                        req: req,
                        topic: topic
                    })
                }
            })
        }
    })
})

router.post('/user/add', function (req, res) {
    var str = req.body.school.split(";")
    var name = req.body.name
    var email = req.body.email
    var password = crypto.createHash("sha256").update(req.body.password).digest('base64')
    var position = req.body.position
    var school = str[1]
    var code_school = str[0]
    var is_write = false
    var is_accept = false
    if (position == 'manager') {
        is_write = true
        is_accept = true
    }
    var data = Admin({
        name: name,
        email: email,
        password: password,
        position: position,
        school: school,
        code_school: code_school,
        is_write: is_write,
        is_accept: is_accept,
        is_block: false,
        list_topic: [],
        token: crypto.createHash("sha256").update(email).digest('hex'),
        created_at: new Date(),
        updated_at: new Date()
    })
    Admin.findOne({email: email}, function (err, user) {
        if (!user) {
            data.save(function (err) {
                if (err) {
                    throw err
                } else {
                    return res.redirect('/list_user')
                }
            })
        }
    })
})

router.post('/school/add', function (req, res) {
    var name = req.body.name
    var code = req.body.code

    var data = School({
        name: name,
        code: code
    })

    School.findOne({name: name}, function (err, school) {
        if (!school) {
            data.save(function (err) {
                return res.redirect('/list_user')
            })
        }
    })
})

router.get('/change_password', function (req, res) {
    return res.render('pages/change_password.ejs')
})

router.post('/change_password', function (req, res) {
    var token = req.session.token
    var old_password = crypto.createHash("sha256").update(req.body.old_password).digest('base64')
    var password = req.body.password
    var repeat = req.body.repeat
    console.log(req.session)
    console.log(res.locals)
    Login.findOne({token: token}, function (err, email) {
        if (err) {
            return res.redirect('/login')
        }
        console.log(email)
        Admin.findOne({email: email.email}, function (err, user) {
            if (err) {
                return console.log(err)
            }

            if (old_password !== user.password) {
                req.flash("msg","Mật khẩu cũ không chính xác");
                res.locals.messages = req.flash();
                return res.render('pages/change_password.ejs')
            }

            if (password !== repeat) {
                req.flash("msg","Mật khẩu mới không trùng nhau");
                res.locals.messages = req.flash();
                return res.render('pages/change_password.ejs')
            }

            user.password = crypto.createHash("sha256").update(password).digest('base64')
            user.save()
            req.flash("messages","Mật khẩu thay đổi thành công");
            res.locals.messages = req.flash();
            return res.render('pages/change_password.ejs')
        })
    })
})

router.post('/:id/update-role', function (req, res) {
    var id = req.body.id
    var is_write = req.body.is_write
    var is_accept = req.body.is_accept
    if (is_write == 'on') {
        is_write = true
    } else {
        is_write = false
    }
    if (is_accept == 'on') {
        is_accept = true
    } else {
        is_accept = false
    }
    Admin.findOne({_id: id}, function (err, user) {
        if (err) {
            return console.error(err)
        }
        user.is_write = is_write
        user.is_accept = is_accept
        user.save()

        return res.redirect('/list_user')
    })
})

router.post('/:id/update-status', function (req, res) {
    var id = req.body.id
    var is_block = req.body.is_block
 
    if (is_block == "true") {
        is_block = false
    } else {
        is_block = true
    }
    Admin.findOne({_id: id}, function (err, user) {
        if (err) {
            return console.error(err)
        }
        user.is_block = is_block
        user.save()
        return res.json({
            success: true,
            data: user
        })
    })
})

router.post('/:id/delete-user', function (req, res) {
    var id = req.body.id
    
    Admin.findOne({_id: id}, function (err, user) {
        if (err) {
            return console.error(err)
        }
        user.remove()
        return res.json({
            success: 1
        })
    })
})

module.exports = router
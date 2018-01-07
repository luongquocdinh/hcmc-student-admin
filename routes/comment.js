let express = require('express')
let path = require('path')
let formidable = require('formidable')
let session = require('express-session')
let fs = require('fs')
let router = express.Router()

let News = require('./../models/news')
let Topic = require('./../models/topic')
let Comment = require('./../models/comment')

let sess;

router.get('/comment', (req, res) => {
    sess = req.session
    var response
    let prev
    let news_id = []
    let ids = []
    Comment.find({})
        .then(data => {
            response = data
            data.map(p => {
                news_id.push(p.news_id)
            })
            news_id.sort()

            for (let i = 0; i < news_id.length; i++) {
                if (news_id[i] !== prev) {
                    ids.push(news_id[i])
                }
                prev = news_id[i]
            }

            News.find({
                _id: {
                    $in: ids
                } 
            }).then(data => {
                let news = {}
                data.map(d => {
                    news[d._id] = d
                })
                let comments = [];
                response.map(r => {
                    if (news[r.news_id]) {
                        let item = {
                            id: r._id,
                            user: r.name,
                            content: r.content,
                            news_id: r.news_id,
                            title: news[r.news_id].title
                        }
                        comments.push(item);
                    }
                })
                
                return res.render('pages_comment/comment.ejs', {
                    datas: comments,
                    req: req
                })
            })

        })
        .catch(err => {
            return res.render('pages_comment/index.ejs');
        })
})

module.exports = router


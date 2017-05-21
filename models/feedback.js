var mongoose = require('mongoose')
var Schema = mongoose.Schema

var feedback = new Schema({
    "title": {type: String},
    "content": {type: String},
    "user_mail": {type: String},
    "created_at": { type: Date, default: Date.now() },
    "updated_at"    : { type: Date, default: Date.now() }
})

var FeedBack = mongoose.model('feedback', feedback)

module.exports = FeedBack
var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var news = new Schema({
    source: {type: String },
    topic: {type: String},
    topic_ascii: {type: String},

    title: {type: String},
    thumbnail: {type: String},
    brief: {type: String},
    content: {type: String},
    is_accept: {type: Boolean},

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
},
{ versionKey: false }
)

var News = mongoose.model('news', news)

module.exports = News
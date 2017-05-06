var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var news = new Schema({
    topic: {type: String},
    is_enable: {type: Boolean},
    news: [{
        title: {type: String},
        thumbnail: {type: String},
        brief: {type: String},
        content: {type: String},
        is_accept: {type: Boolean},
        concern: {type: String},
        created_at: { type: Date, default: Date.now},
        updated_at: { type: Date, default: Date.now}
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
},
{ versionKey: false }
)

var News = mongoose.model('news', news)

module.exports = News
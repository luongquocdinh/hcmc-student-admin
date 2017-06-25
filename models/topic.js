var mongoose = require('mongoose')
var Schema = mongoose.Schema

var topic = new Schema({
    topic_ascii: String,
    source: String,
    topic: String
})

var Topic = mongoose.model('topic', topic)

module.exports = Topic
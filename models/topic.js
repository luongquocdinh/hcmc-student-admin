var mongoose = require('mongoose')
var Schema = mongoose.Schema

var topic = new Schema({
    id_topic: Schema.Types.ObjectId,
    name_source: String,
    name_topic: String
})

var Topic = mongoose.model('topic', topic)

module.exports = Topic
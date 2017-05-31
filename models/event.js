var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var event = new Schema({
    title: {type: String},
    thumbnail: {type: String},
    brief: {type: String},
    content: {type: String},
    is_accept: {type: Boolean},
    startDate: {type: Date},
    endDate: {type: Date},
    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now}
},
{ versionKey: false }
)

var Event = mongoose.model('event', event)

module.exports = Event
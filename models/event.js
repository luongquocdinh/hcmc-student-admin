var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var event = new Schema({
    title: {type: String},
    thumbnail: {type: String},
    brief: {type: String},
    content: {type: String},
    number: {type: Number},
    number_register:{type: Number},
    address: {type: String},
    deadline: {type: Number},

    is_accept: {type: Boolean},

    startDate: {type: Number},
    endDate: {type: Number},

    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now}
},
{ versionKey: false }
)

var Event = mongoose.model('event', event)

module.exports = Event
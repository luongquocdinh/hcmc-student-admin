var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var images = new Schema({
    title: {type: String},
    images: {type: Array},
    is_accept: {type: Boolean},
    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now}
},
{ versionKey: false }
)

var Images = mongoose.model('images', images)

module.exports = Images
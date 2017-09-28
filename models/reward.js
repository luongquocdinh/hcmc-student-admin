var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var reward = new Schema({
    name: {type: String},
    thumbnail: {type: String},
    detail: {type: String},

    number: {type: Number},
    deadline: {type: Number},

    is_enable: {type: Boolean, default: true},

    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now}
},
{ versionKey: false }
)

var Reward = mongoose.model('reward', reward)

module.exports = Reward
var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var reward = new Schema({
    name: {type: String},
    thumbnail: {type: String},
    detail: {type: String},
    point: {type: Number},

    number: {type: Number},
    number_redeem: {type: Number, default: 0},
    deadline: {type: Number},

    is_enable: {type: Boolean, default: true},

    partner: [{
        name: {type: String},
        address: {type: String},
        number: {type: Number}
    }],

    created_at: { type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now}
},
{ versionKey: false }
)

var Reward = mongoose.model('reward', reward)

module.exports = Reward
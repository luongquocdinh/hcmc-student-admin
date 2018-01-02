var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.Promise = require('bluebird');

var redeem = new Schema({
    user_id: {type: String, index: true},
    email: {type: String},
    name: {type: String},
    phone: {type: String},
    reward_id: {type: String, index: true},
    serial: {type: String},

    created_date: {type: Date, default: Date.now()},
    updated_date: {type: Date, default: Date.now()}
})

var Redeem = mongoose.model('redeem', redeem)

module.exports = Redeem
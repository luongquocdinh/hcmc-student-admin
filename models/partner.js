var mongoose = require('mongoose')
var Schema = mongoose.Schema

var partner = new Schema({
    "user_id": {type: String},
    "reward_id": {type: String},
    "number": {type: Number},
    "redeem": {type: Number, default: 0},

    "created_at": { type: Date, default: Date.now() },
    "updated_at"    : { type: Date, default: Date.now() }
})

var Partner = mongoose.model('partner', partner)

module.exports = Partner
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var users = new Schema({
  "name": String,
  "email": String,
  "password": String,
  "avatar": String,
  "phone": Number,
  "is_block": Boolean,
  "is_active": Boolean,
  "role": String,
  "token": String,
  "created_at": { type: Date },
  "updated_at"    : { type: Date }
})

var User = mongoose.model('users', users)

module.exports = User

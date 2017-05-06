var mongoose = require('mongoose')
var Schema = mongoose.Schema

var admin = new Schema({
  "name": String,
  "email": String,
  "password": String,
  "position": String,
  "is_block": Boolean,
  "is_write": Boolean,
  "is_accept": Boolean,
  "list_topic": [],
  "school": String,
  "code_school": String,
  "created_at": { type: Date },
  "updated_at": { type: Date }
})

var Admin = mongoose.model('admin', admin)

module.exports = Admin

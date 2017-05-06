var mongoose = require('mongoose')
var Schema = mongoose.Schema

var school = new Schema({
    name: String,
    code: String,
})

var School = mongoose.model('school', school)

module.exports = School
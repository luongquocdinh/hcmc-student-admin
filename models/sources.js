var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

var source = new Schema({
    name: {type: String},
    origin_url: {type: String},
    url: {type: String},
    crawler: {
        link: {type: Array},
        detail: {
            title: {type: String},
            thumbnail: {type: String},
            brief: {type: String},
            content: {type: String},
            author: {type: String},
            datetime: {type: String}
        }
    },
    is_enable: {type: Boolean, default: true}
});

var Source = mongoose.model('source', source);

module.exports = Source;
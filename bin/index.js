var http = require('http')
var app = require('./../src/app')
var mongoose = require('mongoose')
var server = http.createServer(app)

var boot = function () {
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'))
  })
  // mongodb://heroku_ncdhz4rn:j51dpjdmpitu8v7onnt61uhi56@ds133281.mlab.com:33281/heroku_ncdhz4rn
  // mongodb://localhost:27017/demo_be
  mongoose.connect('mongodb://heroku_ncdhz4rn:j51dpjdmpitu8v7onnt61uhi56@ds133281.mlab.com:33281/heroku_ncdhz4rn', { useMongoClient: true })
    .then(result => {
      console.log("Connect database successful")
    })
    .catch(err => {
      console.log(err);
    })
}

var shutdown = function () {
  server.close()
}
if (require.main === module) {
  boot()
} else {
  console.info('Running app as module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = app.get('port')
}

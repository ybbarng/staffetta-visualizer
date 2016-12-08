var http = require('http');
var ecstatic = require('ecstatic')({root: __dirname + '/app', handleError: false});
var router = require('routes')();
var fs = require('fs');

dataFolder = './app/data/';
var dataList = [];
fs.readdir(dataFolder, function(error, files) {
  files.forEach(function(file) {
    var dataName = file.split('.')[0];
    if (dataList.indexOf(dataName) === -1) {
      dataList.push(dataName);
    }
  });
});

router.addRoute('/datalist.json', function(req, res, params) {
  res.end(JSON.stringify(dataList));
});

var server = http.createServer(function(req, res) {
  var m = router.match(req.url);
  if (m) {
    m.fn(req, res, m.params);
  } else {
    ecstatic(req, res);
  }
});

var port = 12025;
server.listen(port, function() {
  console.log('Server is started.');
  console.log('Listening on ' + port);
});

var ecstatic = require('ecstatic');
var server = require('http').createServer(
  ecstatic({root: __dirname + '/app', handleError: false})
);

var port = 12025;
server.listen(port, function() {
  console.log('Server is started.');
  console.log('Listening on ' + port);
});

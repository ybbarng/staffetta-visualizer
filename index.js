var express = require('express');
var multer = require('multer');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/app'));

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, __dirname + '/app/data/');
    },
    filename: function(req, file, callback) {
      var fileName = req.body.simulationName;
      var extension = file.fieldname === 'csc' ? 'csc' : 'txt';
      callback(null, fileName + '.' + extension);
    }
});
var upload = multer({ storage: storage });

dataFolder = __dirname + '/app/data/';
var dataList = [];
function loadDataList() {
  dataList = [];
  fs.readdir(dataFolder, function(error, files) {
    files.forEach(function(file) {
      var dataName = file.split('.')[0];
      if (dataList.indexOf(dataName) === -1) {
        dataList.push(dataName);
      }
    });
  });
}
loadDataList();

app.get('/datalist.json', function(req, res) {
  res.send(JSON.stringify(dataList));
});

app.post('/upload', upload.fields([{
        'name': 'csc', maxCount: 1
      }, {
        'name': 'log', maxCount:1
      }]), function(req, res, next) {
  loadDataList();
  res.sendStatus(200);
});

var port = 12025;
app.listen(port, function() {
  console.log('Server is started.');
  console.log('Listening on ' + port);
});

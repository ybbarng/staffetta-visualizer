var fs = require('fs');
var $ = require('jquery');
var dataParser = require('./data-parser.js');

$(function() {
  parser = new dataParser.DataParser(onComplete);

  function onComplete(csc, log) {
    console.log(csc);
    console.log(log);
  }
});

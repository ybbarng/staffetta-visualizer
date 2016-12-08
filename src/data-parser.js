var $ = require('jquery');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

exports.DataParser = function(onComplete) {
  this.cscReady = false;
  this.logReady = false;

  this.onComplete = onComplete;
  var that = this;
  $.get('data/infovis.csc', function(data) {
    that.cscData = data;
    that.parseCsc();
  });
  $.get('data/infovis.txt', function(data) {
    that.logData = data;
    that.parseLog();
  });
};

exports.DataParser.prototype = {
  parseCsc: function() {
    var that = this;
    parser.parseString(this.cscData, function(error, result) {
      if (error) {
        console.log(error);
        return;
      }
      that.cscData = result;
      that.cscReady = true;
      that.checkComplete();
    });
  },
  parseLog: function(onComplete) {
    this.logData = this.logData.split('\n');
    this.logReady = true;
    this.checkComplete();
  },
  checkComplete: function() {
    if (this.cscReady && this.logReady) {
      this.onComplete(this.cscData, this.logData);
    }
  }
};

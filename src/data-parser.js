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
  $.get('data/infovis_log.txt', function(data) {
    that.logData = data;
    that.parseLog();
  });
};

exports.DataParser.prototype = {
  parseCsc: function() {
    var that = this;
    parser.parseString(this.cscData, function(error, result) {
      that.cscData = result;
      that.cscReady = true;
      that.checkComplete();
    });
  },
  parseLog: function(onComplete) {
    this.logReady = false;
  },
  checkComplete: function() {
    if (this.cscReady && this.logReady) {
      this.onComplete(this.cscData, this.logData);
    }
  }
};

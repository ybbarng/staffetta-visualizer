var $ = require('jquery');

exports.DataParser = function() {
  this.initiate();
};

exports.DataParser.prototype = {
  initiate: function() {
    $.get('data/infovis.csc', function(data) {
      this.csc_data = data;
      console.log(this.csc_data);
    });
    $.get('data/infovis_log.txt', function(data) {
      this.log_data = data;
      console.log(this.log_data);
    });
    this.parse();
  },
  parse: function() {
    this.parse_csc();
    this.parse_log();
  },
  parse_csc: function() {
  },
  parse_log: function() {
  }
};

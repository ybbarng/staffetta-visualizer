var fs = require('fs');
var $ = require('jquery');
var dataParser = require('./data-parser.js');
var node = require('./node.js');

$(function() {
  var parser = new dataParser.DataParser(onComplete);
  var nodes = [];

  function onComplete(csc, log) {
    initiateSimulation(csc);
  }

  function initiateSimulation(csc) {
    var motes = csc.simconf.simulation[0].mote;
    for (var i = 0; i < motes.length; i++) {
      var mote = motes[i];
      var moteId = mote.interface_config[1].id;
      var location = mote.interface_config[0];
      nodes.push(new node.Node(moteId, location.x, location.y));
    }
  }
});

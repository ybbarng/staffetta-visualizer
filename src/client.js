var fs = require('fs');
var $ = require('jquery');
var dataParser = require('./data-parser.js');
var node = require('./node.js');

$(function() {
  var parser = new dataParser.DataParser(onComplete);
  var nodes = [];

  var svg_width = 600;
  var svg_height = 600;

  var x = d3.scale.linear().domain([-10, 130]).range([0, svg_width]);
  var y = d3.scale.linear().domain([-10, 130]).range([0, svg_height]);

  var chart = d3.select('#visualizer')
    .append('svg').attr({width: svg_width, height: svg_height})
    .append('g');

  var elementsGroup = chart.append('g')
    .attr('class', 'elements');

  function refresh() {
    var nodeViews = elementsGroup.selectAll('circle')
      .data(nodes);

    nodeViews
      .transition('update')
      .duration(500)
      .delay(function(d, i) {return 2 * i;})
      .attr('transform', function(d) {
        return 'translate(' + x(d.x) + ', ' + y(d.y) + ')';
      })
      .style('fill', 'yellow');

    var newNodeViews = nodeViews.enter()
      .append('circle')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x) + ', ' + y(d.y) + ')';
      })
      .attr('r', 14)
      .style('fill', 'yellow');
  }

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
    refresh();
  }
});

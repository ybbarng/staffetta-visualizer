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

  var nodesGroup = chart.append('g')
    .attr('class', 'nodes');

  function refresh() {
    var nodeViews = nodesGroup.selectAll('node')
      .data(nodes);

    var newNodeViews = nodeViews.enter()
      .append('g')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x) + ', ' + y(d.y) + ')';
      })
      .style('opacity', 0);

    newNodeViews.append('circle')
      .attr('r', 14)
      .attr('stroke', 'gray')
      .attr('stroke-width', 2)
      .style('fill', function(d) {
        return 'rgba(255, 255, ' + Math.min(parseInt(d.frequency * 255 / 25), 255) + ', 1)';
      });

    var nodeCircles = nodesGroup.selectAll('circle')
      .transition('update')
      .duration(100)
      .style('fill', function(d) {
        return 'rgba(255, 255, ' + Math.min(parseInt(d.frequency * 255 / 25), 255) + ', 1)';
      });

    var nodeLabels = newNodeViews.append('text')
      .text(function(d) {
        return d.nodeId;
      })
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central');

    newNodeViews.transition('update')
      .duration(500)
      .delay(function(d, i) {return 50 * i;})
      .style('opacity', 1);
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

var fs = require('fs');
var $ = require('jquery');
var dataParser = require('./data-parser.js');
var node = require('./node.js');
var flow = require('./flow.js');

$(function() {
  var parser = new dataParser.DataParser(onComplete);
  var nodes = [];
  var flows = [];
  var logReader = null;

  var svg_width = 900;
  var svg_height = 600;
  var chart_width = 600;
  var chart_height = 600;
  var legend_left_margin = 10;
  var legend_top_margin = 140;
  var logReaderInterval = 500;

  var x = d3.scale.linear().domain([-10, 130]).range([0, chart_width]);
  var y = d3.scale.linear().domain([-10, 130]).range([0, chart_height]);

  var svg = d3.select('#visualizer')
    .append('svg').attr({width: svg_width, height: svg_height});
  var chart = svg.append('g');

  var defs = svg.append('defs');

  defs.append('marker')
    .attr({
        'id': 'arrow',
        'viewBox': '0 -5 10 10',
        'refX': 5,
        'refY': 0,
        'markerWidth': 4,
        'markerHeight': 4,
        'orient': 'auto'
    })
    .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', 'arrowHead');

  var nodesGroup = chart.append('g')
    .attr('class', 'nodes');

  var flowsGroup = chart.append('g')
    .attr('class', 'flows');

  // for legend
  var color = d3.scale.linear()
    .domain([0, 25])
    .range(['rgb(89, 255, 255)', 'rgb(255, 155, 255)']);

  svg.append('g')
    .attr('class', 'colorLegend')
    .attr('transform', 'translate(' +
        (chart_width + legend_left_margin) + ', ' +
        legend_top_margin + ')');

  var colorLegend = d3.legend.color()
    .cells([1, 5, 10, 15, 20, 25])
    .labels(["low (1)", "", "default (10)", "", "", "high (25)"])
    .scale(color)
    .shapePadding(0)
    .title('Wake Up Frequency');

  svg.select('.colorLegend')
    .call(colorLegend);

  svg.select('.legendCells')
    .attr('transform', 'translate(0, 15)')

  svg.append('line')
    .attr('class', 'layout')
    .attr({
        'x1': 600,
        'y1': 0,
        'x2': 600,
        'y2': 600
    });

  var nodePreviewSection = svg.append('g')
    .attr('class', 'nodePreviewSection')
    .attr('transform', 'translate(610, 20)')

  nodePreviewSection.append('text')
    .attr('class', 'title')
    .text('Node Preview');

  var nodePreview = nodePreviewSection.append('g')
    .attr('class', 'nodePreview')
    .attr('transform', 'translate(32, 40)');

  nodePreview.append('circle')
    .attr('r', 30)
    .attr('stroke', 'gray')
    .attr('stroke-width', 2)
    .style('fill', color(10));

  nodePreview.append('text')
    .text('nodeID')
    .style('text-anchor', 'middle')
    .style('dominant-baseline', 'central');

  nodePreview.append('line')
    .attr('class', 'pointer')
    .attr({
        'x1': 17,
        'y1': 17,
        'x2': 30,
        'y2': 30
    });
  nodePreview.append('line')
    .attr('class', 'pointer')
    .attr({
        'x1': 30,
        'y1': 30,
        'x2': 60,
        'y2': 30
    });

  nodePreview.append('text')
  .text('Color: Wake up frequency (10)')
    .style('dominant-baseline', 'central')
    .attr('transform', 'translate(70, 30)');

  function fillCircle(d) {
    return color(Math.min(d.frequency, 25));
  }

  function refresh() {
    var nodeViews = nodesGroup.selectAll('.node')
      .data(nodes, function(d) { return d.nodeId; });

    var newNodeViews = nodeViews.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x) + ', ' + y(d.y) + ')';
      })
      .style('opacity', 0);

    newNodeViews.append('circle')
      .attr('r', 14)
      .attr('stroke', 'gray')
      .attr('stroke-width', 2)
      .style('fill', fillCircle);

    var nodeCircles = nodesGroup.selectAll('circle')
      .transition('update')
      .duration(100)
      .style('fill', fillCircle);

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

    var flowViews = flowsGroup.selectAll('.arrow')
      .data(flows, function(d) { return d.id; });

    var newFlowViews = flowViews.enter()
      .append('line')
      .attr({
          'class': 'arrow',
          'marker-end': 'url(#arrow)',
          'x1': function(d) { return x(d.x1); },
          'y1': function(d) { return y(d.y1); },
          'x2': function(d) { return x(d.x2); },
          'y2': function(d) { return y(d.y2); }
      })
      .style('opacity', 0)
      .transition('enter')
      .duration(500)
      .style('opacity', 1);

    flowViews.exit()
      .transition('exit')
      .duration(500)
      .style('opacity', 0)
      .remove();
  }

  function onComplete(csc, log) {
    initiateSimulation(csc);
    run(log);
  }

  function initiateSimulation(csc) {
    var motes = csc.simconf.simulation[0].mote;
    for (var i = 0; i < motes.length; i++) {
      var mote = motes[i];
      var moteId = mote.interface_config[1].id[0];
      var location = mote.interface_config[0];
      nodes.push(new node.Node(moteId, location.x, location.y));
    }
    refresh();
  }

  function run(log) {
    var index = 0;
    logReader = setInterval(function() {
      while (true) {
        var message = log[index];
        if (index >= log.length || message === '') {
          stopLogReader();
          break;
        }
        message = message.split('\t');
        var timestamp = message[0];
        var nodeIndex = parseInt(message[1].substring(3)) - 1;
        var message = message[2];
        var result = parseNodeMessage(nodeIndex, timestamp, message);
        index += 1;
        if (result) {
          refresh();
          break;
        }
      }
    }, logReaderInterval);
  }

  function parseNodeMessage(nodeIndex, timestamp, message) {
    var node = nodes[nodeIndex];
    if (node.isSink) {
      return false;
    }
    if (/^\d+ \d+ \d+$/.test(message)) {
      var argv = message.split(' ').map(Number);
      if (argv[0] === 2) {
        node.onAck(timestamp, argv[1], argv[2]);
        return true;
      } else if (argv[0] === 5) {
        var newFlow = new flow.Flow(nodes[argv[1] - 1], nodes[argv[2] - 1]);
        flows.push(newFlow);
        setTimeout(function() {
          var index = flows.indexOf(newFlow);
          if (index > -1) {
            flows.splice(index, 1);
            refresh();
          }
        }, 2000);
        return true;
      }
      return false;
    } else if (message.indexOf('collision') !== -1) {
      node.onCollision(timestamp);
      return false;
    }
    return false;
  }

  function stopLogReader() {
    if (logReader !== null) {
      window.clearInterval(logReader);
      logReader = null;
    }
  }
});

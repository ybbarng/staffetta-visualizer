var fs = require('fs');
var $ = require('jquery');
var dataParser = require('./data-parser.js');
var node = require('./node.js');
var collision = require('./collision.js');
var flow = require('./flow.js');
var legend = require('./legend.js');
var SimulationInfo = require('./simulation-info.js');

$(function() {
  var $dataSelect = $('#datafile');
  $dataSelect.change(loadDataFile);

  var modal = $('#uploadModal')[0];
  $('#uploadButton').click(function() {
    modal.style.display = 'block';
  });

  $('.close').click(function() {
    modal.style.display = 'none';
  });

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  $('#upload').submit(function(e) {
    e.preventDefault();
    var formData = new FormData($('#upload')[0]);
    $.ajax({
        type: 'POST',
        url: '/upload',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function(result, status) {
          loadDataFileList();
					modal.style.display = 'none';
        },
        error: function(result, status) {
          console.log(result);
          console.log(status);
        }
    });
  });

  var $defaultOption = $('<option>', {
        value: '',
        text: 'Select Simulation File'
  }).attr('disabled', true)
    .attr('selected', true);
  function loadDataFileList() {
    $dataSelect.empty();
    $.get('/datalist.json', function(data) {
      $dataSelect.append($defaultOption);
      var dataList = typeof data === 'string' ? JSON.parse(data) : data;
      dataList.map(function(dataName) {
        $dataSelect.append($('<option>', {
              value: dataName,
              text: dataName
        }));
      });
    });
  }
  loadDataFileList();

  var parser = null;
  function loadDataFile() {
    var filename = $(this).find('option:selected').text();
    stopLogReader();
    parser = new dataParser.DataParser(onComplete, filename);

  }
  var nodes = [];
  var collisions = [];
  var flows = [];
  var simulationInfo = new SimulationInfo.SimulationInfo();
  var logReader = null;

  var chart_width = 700;
  var chart_height = 700;
  var chart_padding = 50;
  var legend_left_margin = 10;
  var logReaderInterval = 500;
  var svg_width = chart_width + 350;
  var svg_height = chart_height;

  var x = d3.scale.linear().domain([-10, 130]).range([chart_padding, chart_width - chart_padding]);
  var y = d3.scale.linear().domain([-10, 130]).range([chart_padding, chart_height - chart_padding]);

  var svg = d3.select('#visualizer')
    .append('svg').attr({width: svg_width, height: svg_height});
  var chart = svg.append('g');

  setupArrowHead(svg);

  var nodesGroup = chart.append('g')
    .attr('class', 'nodes');

  var collisionsGroup = chart.append('g')
    .attr('class', 'collisions');

  var flowsGroup = chart.append('g')
    .attr('class', 'flows');

  var color = d3.scale.linear()
    .domain([0, 25])
    .range(['rgb(89, 255, 255)', 'rgb(255, 155, 255)']);

  svg.append('line')
    .attr('class', 'layout')
    .attr({
        'x1': chart_width,
        'y1': 0,
        'x2': chart_width,
        'y2': svg_height
    });

  var rightStart = chart_width + legend_left_margin;
  // Right side of svg
  legend.setup(svg, rightStart, 0, color);

  var simulationInfoView = svg.append('g')
    .attr('class', 'simulationInfo')
    .attr('transform', 'translate(' + rightStart + ', ' + (svg_height - 100) + ')');

  var totalCollisionView = simulationInfoView.append('text')
    .attr('class', 'totalCollision')
    .attr('transform', 'translate(0, 0)');

  var timestampView = simulationInfoView.append('text')
    .attr('class', 'timestamp')
    .attr('transform', 'translate(0, 20)');

  var totalPowerView = simulationInfoView.append('text')
    .attr('class', 'totalPower')
    .attr('transform', 'translate(0, 40)');

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.frequency + ' wake-ups/second';
    });

  svg.call(tip);

  function fillCircle(d) {
    return color(Math.min(d.frequency, 25));
  }

  function refresh() {
    var nodeViews = nodesGroup.selectAll('.node')
      .data(nodes, function(d) { return d.nodeId; });

    nodeViews.transition('update')
      .duration(500)
      .attr('transform', function(d) {
        return 'translate(' + x(d.x) + ', ' + y(d.y) + ')';
      });

    var newNodeViews = nodeViews.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x) + ', ' + y(d.y) + ')';
      })
      .style('opacity', 0)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    newNodeViews.append('circle')
      .attr('r', 14)
      .attr('stroke', 'gray')
      .attr('stroke-width', 2)
      .style('fill', fillCircle);

    var nodeCircles = nodeViews.select('circle')
      .transition('update')
      .duration(100)
      .style('fill', fillCircle);

    var nodeLabels = newNodeViews.append('text')
      .text(function(d) {
        return d.nodeId;
      })
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central');

    newNodeViews.append('text')
      .attr('class', 'dutyCycleAndPower')
      .attr('transform', 'translate(0, -24)')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central');

    var nodePowerMessage = nodeViews.select('text.dutyCycleAndPower')
      .transition('update')
      .duration(500)
      .text(function(d) {
        return 'D: ' + (d.dutyCycle / 10) + '% P: ' + d.power + 'μJ';
      });

    function printInAndOutMessage(d) {
      return d.inMessage + ' / ' + d.outMessage;
    }

    newNodeViews.append('text')
      .attr('class', 'inOutMessage')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .attr('transform', 'translate(0, 24)');

    var nodeLabels = nodeViews.select('text.inOutMessage')
      .transition('update')
      .duration(500)
      .text(printInAndOutMessage);

    newNodeViews.transition('enter')
      .duration(500)
      .delay(function(d, i) {return 50 * i;})
      .style('opacity', 1);

    nodeViews.exit()
      .transition('exit')
      .duration(500)
      .style('opacity', 0)
      .remove();

    var collisionViews = collisionsGroup.selectAll('.collision')
      .data(collisions, function(d) { return d.id; });

    var newCollisionViews = collisionViews.enter()
      .append('svg:image')
      .attr('class', 'collision')
      .attr('xlink:href', '/static/collision.svg')
      .attr('width', 25)
      .attr('height', 25)
      .attr('x', function(d) { return x(d.x); })
      .attr('y', function(d) { return y(d.y); })
      .style('opacity', 0)
      .transition('enter')
      .duration(500)
      .style('opacity', 1);

      collisionViews.exit()
      .transition('exit')
      .duration(500)
      .style('opacity', 0)
      .remove();

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
    refreshSimulationInfo();
  }

  function refreshSimulationInfo() {
    simulationInfoView.data(simulationInfo);
    simulationInfoView.select('.totalCollision')
      .text(function(d) {
        return 'Collisions: ' + simulationInfo.collision;
      });
    simulationInfoView.select('.timestamp')
      .text(function(d) {
        return 'Timestamp: ' + simulationInfo.timestamp + ' / ' + simulationInfo.lastTimestamp;
      });
    simulationInfoView.select('.totalPower')
      .text(function(d) {
        return 'Power: ' + simulationInfo.totalPower + 'μJ';
      });
  }

  function onComplete(csc, log) {
    initiateSimulation(csc);
    run(log);
  }

  function initiateSimulation(csc) {
    nodes = [];
    flows = [];
    collisions = [];
    simulationInfo.initiate();
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
    var lastMessage = log[log.length - 1];
    if (lastMessage === '') {
      lastMessage = log[log.length - 2];
    }
    simulationInfo.lastTimestamp = lastMessage.split('\t')[0];
    logReader = setInterval(function() {
      while (true) {
        var message = log[index];
        if (index >= log.length || message === '') {
          stopLogReader();
          break;
        }
        message = message.split('\t');
        var timestamp = message[0];
        simulationInfo.timestamp = timestamp;
        var nodeIndex = parseInt(message[1].substring(3)) - 1;
        var message = message[2];
        var result = parseNodeMessage(nodeIndex, timestamp, message);
        index += 1;
        if (result) {
          refresh();
          break;
        } else {
          refreshSimulationInfo();
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
        var fromNode = nodes[argv[1] - 1];
        var toNode = nodes[argv[2] - 1];
        var newFlow = new flow.Flow(fromNode, toNode);
        flows.push(newFlow);
        fromNode.outMessage += 1;
        toNode.inMessage += 1;
        refresh();
        setTimeout(function() {
          var index = flows.indexOf(newFlow);
          if (index > -1) {
            flows.splice(index, 1);
            refresh();
          }
        }, 2000);
        return true;
      } else if (argv[0] === 6) {
        node.power = parseInt(argv[1]);
        node.dutyCycle = parseInt(argv[2]);
        simulationInfo.updateTotalPower(nodes);
        return true;
      }
      return false;
    } else if (message.indexOf('collision') !== -1) {
      node.onCollision(timestamp);
      var newCollision = new collision.Collision(node);
      collisions.push(newCollision);
      simulationInfo.collision += 1;
      refresh();
        setTimeout(function() {
          var index = collisions.indexOf(newCollision);
          if (index > -1) {
            collisions.splice(index, 1);
            refresh();
          }
        }, 2000);
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

  function setupArrowHead(svg) {
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
  }
});

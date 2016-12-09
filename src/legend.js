exports.setup = function(svg, x, y, colorScale) {
  var nodeLegendY = 50;
  var flowLegendY = 170;
  var colorLegendY = 240;
  var indent = 10;
  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

  legend.append('text')
    .attr('transform', 'translate(0, 25)')
    .attr('class', 'legend-main-title')
    .text('Legend')
    .style('text-anchor', 'start');

  nodeLegend(legend, indent, nodeLegendY, colorScale(10));
  flowLegend(legend, indent, flowLegendY);
  colorLegend(legend, indent, colorLegendY, colorScale);
};

function nodeLegend(legend, x, y, color) {
  var nodeLegendSection = legend.append('g')
    .attr('class', 'nodeLegendSection')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

  nodeLegendSection.append('text')
    .attr('class', 'legendTitle')
    .text('Node');

  var nodeLegend = nodeLegendSection.append('g')
    .attr('class', 'nodeLegend')
    .attr('transform', 'translate(32, 40)');

  nodeLegend.append('circle')
    .attr('r', 30)
    .attr('stroke', 'gray')
    .attr('stroke-width', 2)
    .style('fill', color);

  nodeLegend.append('text')
    .text('nodeID')
    .style('text-anchor', 'middle')
    .style('dominant-baseline', 'central');

  nodeLegend.append('line')
    .attr('class', 'pointer')
    .attr({
        'x1': 17,
        'y1': 17,
        'x2': 30,
        'y2': 30
    });

  nodeLegend.append('line')
    .attr('class', 'pointer')
    .attr({
        'x1': 30,
        'y1': 30,
        'x2': 60,
        'y2': 30
    });

  nodeLegend.append('text')
    .text('Color: wake up frequency')
    .style('dominant-baseline', 'central')
    .attr('transform', 'translate(70, 30)');
}

function flowLegend(legend, x, y) {
  var flowLegendSection = legend.append('g')
    .attr('class', 'flowLegendSection')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

  flowLegendSection.append('text')
    .attr('class', 'legendTitle')
    .text('Flow');

  flowLegendSection.append('line')
    .attr({
        'class': 'arrowLegend',
        'marker-end': 'url(#arrow)',
        'x1': 0,
        'y1': 15,
        'x2': 50,
        'y2': 15,
    });

  flowLegendSection.append('text')
    .text(': A data flow, sent from left to right')
    .style('dominant-baseline', 'central')
    .attr('transform', 'translate(60, 15)');
}

function colorLegend(legend, x, y, colorScale) {
  legend.append('g')
    .attr('class', 'colorLegend')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

  var colorLegend = d3.legend.color()
    .cells([1, 5, 10, 15, 20, 25])
    .labels(["low (1)", "", "default (10)", "", "", "high (25)"])
    .scale(colorScale)
    .shapePadding(0)
    .title('Wake Up Frequency');

  legend.select('.colorLegend')
    .call(colorLegend);

  legend.select('.legendCells')
    .attr('transform', 'translate(0, 15)');
}

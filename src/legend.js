exports.setup = function(svg, x, y, colorScale) {
  var nodePreviewY = 50;
  var colorLegendY = 170;
  var indent = 10;
  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

  legend.append('text')
    .attr('transform', 'translate(0, 25)')
    .attr('class', 'legend-main-title')
    .text('Legend')
    .style('text-anchor', 'start');

  nodePreview(legend, indent, nodePreviewY, colorScale(10));
  colorLegend(legend, indent, colorLegendY, colorScale);
};

function nodePreview(legend, x, y, color) {
  var nodePreviewSection = legend.append('g')
    .attr('class', 'nodePreviewSection')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

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
    .style('fill', color);

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
    .text('Color: wake up frequency')
    .style('dominant-baseline', 'central')
    .attr('transform', 'translate(70, 30)');
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

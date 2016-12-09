exports.setup = function(svg, x, y, color) {
  var nodePreviewSection = svg.append('g')
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
};

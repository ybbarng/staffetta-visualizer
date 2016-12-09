exports.setup = function(svg, x, y, colorScale) {
  svg.append('g')
    .attr('class', 'colorLegend')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

  var colorLegend = d3.legend.color()
    .cells([1, 5, 10, 15, 20, 25])
    .labels(["low (1)", "", "default (10)", "", "", "high (25)"])
    .scale(colorScale)
    .shapePadding(0)
    .title('Wake Up Frequency');

  svg.select('.colorLegend')
    .call(colorLegend);

  svg.select('.legendCells')
    .attr('transform', 'translate(0, 15)')
};

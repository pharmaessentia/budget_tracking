categoriesChart
.width(800)
.height(400)
.dimension(categoryDimension)
.group(categoryGroup)
.x(d3.scaleOrdinal().domain(Object.keys(categoriesDict)))
.margins({top: 0, right: 0, bottom: 100, left: 100})
.xUnits(dc.units.ordinal)
.mouseZoomable(true)
.elasticY(true)
.title(function (p) {
  return p.key + ': $' + numberWithCommas(p.value)
})
.colorAccessor(d => d.key)
.ordinalColors(colorsList);

categoriesChart.renderlet(function (chart) {
// rotate x-axis labels
  categoriesChart.selectAll('g.x text')
  .attr('transform', 'translate(-20,40) rotate(315)');
});

q1Chart /* dc.pieChart('#quarter-chart', 'chartGroup') */
.width(180)
.height(180)
.radius(80)
.innerRadius(30)
.dimension(topCategoryDimension)
.group(q1Group);

q2Chart /* dc.pieChart('#quarter-chart', 'chartGroup') */
.width(180)
.height(180)
.radius(80)
.innerRadius(30)
.dimension(topCategoryDimension)
.group(q2Group);

q3Chart /* dc.pieChart('#quarter-chart', 'chartGroup') */
.width(180)
.height(180)
.radius(80)
.innerRadius(30)
.dimension(topCategoryDimension)
.group(q3Group);

q4Chart /* dc.pieChart('#quarter-chart', 'chartGroup') */
.width(180)
.height(180)
.radius(80)
.innerRadius(30)
.dimension(topCategoryDimension)
.group(q4Group);
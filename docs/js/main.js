////////////////////////////////////////////// LOGIN

var tries = 0;
var a;
var b;

var categoriesDict = {		
	'General and administrative': 'G&A',
	'Information technology': 'G&A',
	'Facility': 'G&A',
	'Legal Corporate and IP': 'G&A',
		
	
	'R&D Management': 'R&D',
	'Biologics': 'R&D',
	'Immunology': 'R&D',
	'Translational Science': 'R&D',
	'Data Science': 'R&D',
  'Pre-IND studies': 'R&D',
			
	'Building Improvement': 'CAPEX',
	'Lab Equipment': 'CAPEX',
	'Office Equipment': 'CAPEX',
	'Computer Equipment': 'CAPEX'}

var categoriesChart = new dc.RowChart("#categories-chart");
var monthsChart = new dc.LineChart("#months-chart");
var yearsChart = new dc.PieChart("#years-chart");

$('#login-button').click(function() {
  tries += 1;

  if (tries >= 4) {
    window.open("https://www.metro.net/","_self");
  }

  var u = $('#login-user-input').val();
  var p = $('#login-pw-input').val();

  if ((u == a) && (p == b)) {
    $('#login-box').addClass('d-none');
  } else {
    $('#num-tries').html(`<span style="color: red">Incorrect login. ${4 - tries} attempts left.</span>`)
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createCharts() {
  // var q1Chart = new dc.PieChart("#q1Chart");
  // var q2Chart = new dc.PieChart("#q2Chart");
  // var q3Chart = new dc.PieChart("#q3Chart");
  // var q4Chart = new dc.PieChart("#q4Chart");
  
  // var barChart = new dc.BarChart("#barChart");
  // var rowChart = new dc.RowChart("#rowChart");
  
  // d3.json('json/budget.json').then(data => {
    const dateFormatSpecifier = '%m/%d/%Y';
    const dateFormat = d3.timeFormat(dateFormatSpecifier);
    const dateFormatParser = d3.timeParse(dateFormatSpecifier);
  
    const ndx = crossfilter(overallData);
    const all = ndx.groupAll();
  
    var categoriesList = [];
  
    overallData.forEach(d => {

      d.dd = dateFormatParser(d["date"]);
      d.month = d3.timeMonth(d.dd);
      d.year = d3.timeYear(d.dd);
      d.amount = Number(d["amount"].replaceAll(',', ''));
      d.category = d["category"];
      categoriesList.push(d.category);
    });

    function createCumulativeGroup(source_group) {
	    return {
        all:function () {
          var cumulate = {};
          return source_group.all().map(function(d) {
            console.log(d.key[0]);
            if(cumulate[d.key[0]]) {
              cumulate[d.key[0]] += d.value;
            } else {
              cumulate[d.key[0]] = d.value;
            }
            //console.log(d.key+" " +cumulate);
            return {key:d.key, value:cumulate[d.key[0]]};
          });
        }
	    };
	  }
  
    var categoryDimension = ndx.dimension(function(d) {return d.category;});
    var categoryGroup = categoryDimension.group().reduceSum(function(d) {return d.amount;});
  
    const monthDimension = ndx.dimension(d => d.month);
    const monthGroup = monthDimension.group().reduceSum(function(d) {return d.amount;});
  
    const yearDimension = ndx.dimension(d => d.year);
    const yearGroup = yearDimension.group().reduceSum(d => d.amount);

    var colorsList = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928', '#ccc'];
  
    categoriesChart
      .width(800)
      .height(400)
      .dimension(categoryDimension)
      .group(categoryGroup)
      .margins({top: 0, right: 0, bottom: 100, left: 100})
      .elasticX(true)
      .title(function (p) {
        return p.key + ': $' + numberWithCommas(p.value)
      })
      .colorAccessor(d => d.key)
      .ordinalColors(colorsList);
  
    yearsChart /* dc.pieChart('#quarter-chart', 'chartGroup') */
      .width(180)
      .height(180)
      .radius(80)
      .innerRadius(30)
      .dimension(yearDimension)
      .group(yearGroup);

    monthsChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
      .width(990)
      .height(200)
      .transitionDuration(1000)
      .margins({top: 30, right: 50, bottom: 30, left: 100})
      .dimension(monthDimension)
      .mouseZoomable(true)
  // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
      // .rangeChart(volumeChart)
      .x(d3.scaleTime().domain([new Date(2022, 11, 31), new Date(2024, 11, 31)]))
      .round(d3.timeMonth.round)
      .xUnits(d3.timeMonths)
      .elasticY(true)
      .renderHorizontalGridLines(true)
  //##### Legend
  
      // Position the legend relative to the chart origin and specify items' height and separation.
      .legend(new dc.Legend().x(800).y(10).itemHeight(13).gap(5))
      .brushOn(false)
      // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
      // legend.
      // The `.valueAccessor` will be used for the base layer
      .group(createCumulativeGroup(monthGroup), 'Total')
      .valueAccessor(d => d.value)
      // Stack additional layers with `.stack`. The first paramenter is a new group.
      // The second parameter is the series name. The third is a value accessor.
      // Title can be called by any stack layer.
      .title(d => {
          let value = d.value ? d.value : d.value;
          if (isNaN(value)) {
              value = 0;
          }
          return `${d.key}\n${value}`;
      });
  
    dc.renderAll();
  // });
}



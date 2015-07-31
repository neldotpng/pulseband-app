(function(){

var root = 'http://localhost:3000';
var data = (function () {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': root + "/healthData",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

var month = data['jul'],
bpVis = d3.select("#bp-visualization"),
width = parseInt(d3.select('.graph').style('width'), 10),
height = parseInt(d3.select('.graph').style('height'), 10),
margins = {
	top: 30,
	right: 20,
	bottom: 30,
	left: 50
},

hrVis = d3.select("#hr-visualization");

// Heart Rate and Blood Pressure Visualization Scales

var xScale = d3.scale.linear().range([margins.left, width - margins.right])
		.domain([d3.min(month, function(d) {
			return d.day;
		}), d3.max(month, function(d) {
			return d.day;
		})]),

	yScaleBP = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.bpmorning.diastolic - 20;
		}), d3.max(month, function(d) {
			return d.bpmorning.systolic + 20;
		})]),

	yScaleHR = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.heartrate - 20;
		}), d3.max(month, function(d) {
			return d.heartrate + 20;
		})]);

bpVis.attr("width", width)
	.attr("height", height);
hrVis.attr("width", width)
	.attr("height", height);

// Heart Rate and Blood Pressure Axes

var xAxis = d3.svg.axis()
		.scale(xScale)
		.ticks(month.length),

	yAxis = d3.svg.axis()
		.orient('left')
		.scale(yScaleBP)
		.ticks(6),

	yAxisHR = d3.svg.axis()
		.orient('left')
		.scale(yScaleHR)
		.ticks(5);

// Append Axes to Graph

bpVis.append("svg:g")
	.attr("class", "axis")
	.attr("class", "xAxis")
	.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
	.call(xAxis);

bpVis.append("svg:g")
	.attr("class", "axis")
	.attr("transform", "translate(" + (margins.left) + ", 0)")
	.call(yAxis);

hrVis.append("svg:g")
	.attr("class", "axis")
	.attr("class", "xAxis")
	.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
	.call(xAxis);

hrVis.append("svg:g")
	.attr("class", "axis")
	.attr("transform", "translate(" + (margins.left) + ", 0)")
	.call(yAxisHR);

// Line Generation Functions

var lineGenS = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleBP(d.bpmorning.systolic);
		})
		.interpolate("cardinal"),

	lineGenD = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleBP(d.bpmorning.diastolic);
		})
		.interpolate("cardinal"),

	lineGenHR = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleHR(d.heartrate);
		})
		.interpolate("cardinal");

// Append Line Paths to Graph

bpVis.append('svg:path')
	.attr('d', lineGenS(month))
	.attr('class', "path-0")
	.attr('stroke-width', 2)
	.attr('fill', 'none');

bpVis.append('svg:path')
	.attr('d', lineGenD(month))
	.attr('class', "path-1")
	.attr('stroke-width', 2)
	.attr('fill', 'none');

hrVis.append('svg:path')
	.attr('d', lineGenHR(month))
	.attr('class', "path-2")
	.attr('stroke-width', 2)
	.attr('fill', 'none');

// Heart Rate and Blood Pressure Hover Tips

var sysTip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>Day:</strong> <span class='tip'>" + d.day + "</span><br><strong class='systolic'>Systolic:</strong> <span>" + d.bpmorning.systolic + " mmHg</span><br><strong class='diastolic'>Diastolic:</strong> <span>" + d.bpmorning.diastolic + " mmHg</span>";
		}
	),
	diaTip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Day:</strong> <span class='tip'>" + d.day + "</span><br><strong class='systolic'>Systolic:</strong> <span>" + d.bpmorning.systolic + " mmHg</span><br><strong class='diastolic'>Diastolic:</strong> <span>" + d.bpmorning.diastolic + " mmHg</span>";
		}
	),
	hrTip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Day:</strong> <span class='tip'>" + d.day + "</span><br><strong>Mean Heart Rate:</strong> <span class='tip'>" + d.heartrate + " BPM</span>";
		}
	);

bpVis.call(sysTip);
bpVis.call(diaTip);
hrVis.call(hrTip);

// Heart Rate and Blood Pressure Data Points

var sysPoints = bpVis.selectAll(".point")
	.data(month)
	.enter().append("svg:circle")
	.attr("stroke", "#C43B73")
	.attr("fill", "#fafafa" )
	.attr("cx", function(d, i) {
		return xScale(d.day);
	})
	.attr("cy", function(d, i) {
		return yScaleBP(d.bpmorning.systolic);
	})
	.attr("r", 5)
	.on('mouseover', sysTip.show)
	.on('mouseout', sysTip.hide),

diaPoints = bpVis.selectAll(".point")
	.data(month)
	.enter().append("svg:circle")
	.attr("stroke", "#45B29D")
	.attr("fill", "#fafafa" )
	.attr("cx", function(d, i) {
		return xScale(d.day);
	})
	.attr("cy", function(d, i) {
		return yScaleBP(d.bpmorning.diastolic);
	})
	.attr("r", 5)
	.on('mouseover', diaTip.show)
	.on('mouseout', diaTip.hide),

hrPoints = hrVis.selectAll(".point")
	.data(month)
	.enter().append("svg:circle")
	.attr("stroke", "#C43B73")
	.attr("fill", "#fafafa" )
	.attr("cx", function(d, i) {
		return xScale(d.day);
	})
	.attr("cy", function(d, i) {
		return yScaleHR(d.heartrate);
	})
	.attr("r", 5)
	.on('mouseover', hrTip.show)
	.on('mouseout', hrTip.hide);

// Blood Work

var blood = (function () {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': root + "/bloodWork",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

// Cholesterol Chart

var chart = d3.select("#chart"),
	bWidth = parseInt(d3.select('.bloodwork .graph').style('width'), 10),
	bHeight = parseInt(d3.select('.bloodwork .graph').style('height'), 10),
	bMargins = {
		top: 20,
		right: 20,
		bottom: 25,
		left: 50
	},

bmonth = blood['jul'],

cholesterol = bmonth[0],

byScale = d3.scale.linear().range([bHeight - bMargins.top, bMargins.bottom])
	.domain([d3.min(bmonth, function(d) {
		return 0;
	}), d3.max(bmonth, function(d) {
		return bHeight - bMargins.bottom;
	})]);

chart.attr("width", bWidth)
	.attr("height", bHeight);

// Cholesterol Tips

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<span style='color: #FFF'>" + d + " mg/dL</span>";
	});

chart.call(tip);

// Append Bars to Graph

var bars = chart.selectAll("rect")
	.data(cholesterol);

bars.enter().append("rect")
	.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 9);
	})
	.attr("y", function(d, i) {
		return bHeight - d - bMargins.bottom;
	})
	.attr("width", 50)
	.attr("height", function(d) {
		return d;
	})
	.attr("fill", "#C43B73")
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);

bars.exit().remove();

bars.attr("y", function(d, i) {
	return bHeight - d - bMargins.bottom;
	})
	.attr("height", function(d) {
		return d;
	});

// Append X-Axis Labels

var text = chart.selectAll("text")
	.data(cholesterol);

text.enter()
	.append("text")
	.attr("text-anchor", "middle")
	.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 9) + 25;
	})
	.attr("y", function(d, i) {
		return bHeight - 5;
	});

chart.select('#chart text:nth-child(4)')
	.text("TOTAL");
chart.select('#chart text:nth-child(5)')
	.text("LDL");
chart.select('#chart text:nth-child(6)')
	.text("HDL");

// Cholesterol y-Axis

var byAxis = d3.svg.axis()
		.orient('left')
		.scale(byScale)
		.ticks(5);

chart.append("svg:g")
	.attr("class", "axis")
	.attr("transform", "translate(" + (bMargins.left) + "," + (-15) + " )")
	.call(byAxis);

// Tryglyceride Chart

var newChart = d3.select("#tryglyceride"),
tryglyceride = bmonth[1];

var tyScale = d3.scale.linear().range([bHeight - bMargins.top, bMargins.bottom])
	.domain([d3.min(bmonth, function(d) {
		return 0;
	}), d3.max(bmonth, function(d) {
		return bHeight - bMargins.bottom;
	})]);

newChart.attr("width", bWidth)
	.attr("height", bHeight);

// Tryglyceride Append Bars	

var tBars = newChart.selectAll("rect")
	.data(tryglyceride);
	
tBars.enter().append("rect")
	.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 7);
	})
	.attr("y", function(d, i) {
		return bHeight - d - bMargins.bottom;
	})
	.attr("width", 50)
	.attr("height", function(d) {
		return d;
	})
	.attr("fill", "#C43B73")
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);

tBars.exit().remove();

tBars.attr("y", function(d, i) {
	return bHeight - d - bMargins.bottom;
	})
	.attr("height", function(d) {
		return d;
	});

// Tryglyceride Append x-Axis labels

var tText = newChart.selectAll("text")
	.data(tryglyceride);
	
tText.enter()
	.append("text")
	.attr("text-anchor", "middle")
	.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 7) + 25;
	})
	.attr("y", function(d, i) {
		return bHeight - 5;
	});

newChart.select('#tryglyceride text:nth-child(3)')
	.text("LAST MONTH");
newChart.select('#tryglyceride text:nth-child(4)')
	.text("CURRENT");

var tyAxis = d3.svg.axis()
		.orient('left')
		.scale(tyScale)
		.ticks(5);

newChart.append("svg:g")
	.attr("class", "axis")
	.attr("transform", "translate(" + (bMargins.left) + "," + (-15) + ")")
	.call(tyAxis);

var changeDate = function(date) {
	var reset = function() {
		$('.axis').remove();
		$('path').remove();
		$('circle').remove();
	};

	reset();
	month = data[date];

// Redraw Graphs

	var xScale = d3.scale.linear().range([margins.left, width - margins.right])
		.domain([d3.min(month, function(d) {
			return d.day;
		}), d3.max(month, function(d) {
			return d.day;
		})]),
	yScaleBP = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.bpmorning.diastolic - 20;
		}), d3.max(month, function(d) {
			return d.bpmorning.systolic + 20;
		})]),
	yScaleHR = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.heartrate - 20;
		}), d3.max(month, function(d) {
			return d.heartrate + 20;
		})]);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.ticks(month.length)

	bpVis.append('svg:path')
		.attr('d', lineGenS(month))
		.attr('class', "path-0")
		.attr('stroke-width', 2)
		.attr('fill', 'none');
	bpVis.append('svg:path')
		.attr('d', lineGenD(month))
		.attr('class', "path-1")
		.attr('stroke-width', 2)
		.attr('fill', 'none');
	hrVis.append('svg:path')
		.attr('d', lineGenHR(month))
		.attr('class', "path-2")
		.attr('stroke-width', 2)
		.attr('fill', 'none');

	bpVis.append("svg:g")
		.attr("class", "axis")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
		.call(xAxis);
	bpVis.append("svg:g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (margins.left) + ", 0)")
		.call(yAxis);
	hrVis.append("svg:g")
		.attr("class", "axis")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
		.call(xAxis);
	hrVis.append("svg:g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (margins.left) + ", 0)")
		.call(yAxisHR);

	var sysPoints = bpVis.selectAll(".point")
		.data(month)
		.enter().append("svg:circle")
		.attr("stroke", "#C43B73")
		.attr("fill", "#fafafa" )
		.attr("cx", function(d, i) {
			return xScale(d.day);
		})
		.attr("cy", function(d, i) {
			return yScaleBP(d.bpmorning.systolic);
		})
		.attr("r", 5)
		.on('mouseover', sysTip.show)
		.on('mouseout', sysTip.hide),
	diaPoints = bpVis.selectAll(".point")
		.data(month)
		.enter().append("svg:circle")
		.attr("stroke", "#45B29D")
		.attr("fill", "#fafafa" )
		.attr("cx", function(d, i) {
			return xScale(d.day);
		})
		.attr("cy", function(d, i) {
			return yScaleBP(d.bpmorning.diastolic);
		})
		.attr("r", 5)
		.on('mouseover', diaTip.show)
		.on('mouseout', diaTip.hide),
	hrPoints = hrVis.selectAll(".point")
		.data(month)
		.enter().append("svg:circle")
		.attr("stroke", "#C43B73")
		.attr("fill", "#fafafa" )
		.attr("cx", function(d, i) {
			return xScale(d.day);
		})
		.attr("cy", function(d, i) {
			return yScaleHR(d.heartrate);
		})
		.attr("r", 5)
		.on('mouseover', hrTip.show)
		.on('mouseout', hrTip.hide);



	bmonth = blood[date];
};

$(document).ready(function() {

	resize();

	// changeDate('feb');
});

// Resize function

function resize() {

// Resize Heart Rate & Blood Pressure Graph

	var width = parseInt(d3.select('.graph').style('width'), 10);

	xScale.range([margins.left, width - margins.right]);

	d3.selectAll('circle')
		.attr('cx', function(d, i) {
			return xScale(d.day);
		});

	d3.select('#bp-visualization')
		.attr('width', width);
	d3.select('#hr-visualization')
		.attr('width', width);

	d3.select('.path-0')
		.attr('d', lineGenS(month));
	d3.select('.path-1')
		.attr('d', lineGenD(month));
	d3.select('.path-2')
		.attr('d', lineGenHR(month));

	if (width < 800) {
		xAxis.ticks(5);
		d3.selectAll('.xAxis')
			.call(xAxis);
	} else if (width > 800) {
		xAxis.ticks(month.length);
		d3.selectAll('.xAxis')
			.call(xAxis);
	}

// Resize Tryglyceride Graph

	var bWidth = parseInt(d3.select('.bloodwork .graph').style('width'), 10);

	bars.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 9);
	});
	text.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 9) + 25;
	});

	tBars.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 6);
	});
	tText.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 6) + 25;
	});

	console.log(month);
	console.log(bmonth);

}

d3.select(window).on('resize', resize);

})();

(function(){
})();
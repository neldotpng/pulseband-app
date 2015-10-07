(function(){

var data = (function () {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "json/main.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

var month = data.healthData['aug'];

var bpVis = d3.select("#bp-visualization"),
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
	.attr('class', 'yAxis')
	.attr("transform", "translate(" + (margins.left) + ", 0)")
	.call(yAxis);

hrVis.append("svg:g")
	.attr("class", "axis")
	.attr("class", "xAxis")
	.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
	.call(xAxis);

hrVis.append("svg:g")
	.attr("class", "axis")
	.attr('class', 'yAxisHR')
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
	.attr('class', 'sysPoints')
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
	.attr('class', 'diaPoints')
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
	.attr('class', 'hrPoints')
	.attr("cx", function(d, i) {
		return xScale(d.day);
	})
	.attr("cy", function(d, i) {
		return yScaleHR(d.heartrate);
	})
	.attr("r", 5)
	.on('mouseover', hrTip.show)
	.on('mouseout', hrTip.hide);

// Cholesterol Chart

var chart = d3.select("#chart"),
	bWidth = parseInt(d3.select('.bloodwork .graph').style('width'), 10),
	bHeight = parseInt(d3.select('.bloodwork .graph').style('height'), 10),
	bMargins = {
		top: 20,
		right: 20,
		bottom: 25,
		left: 50
	};

var bmonth = data.bloodwork['aug'];

var cholesterol = bmonth[0],

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
	.attr('class', 'byAxis')
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
		return 2 * (i + 1) * (bWidth / 6);
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
		return 2 * (i + 1) * (bWidth / 6) + 25;
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
	.attr('class', 'tyAxis')
	.attr("transform", "translate(" + (bMargins.left) + "," + (-15) + ")")
	.call(byAxis);

function changeDate(date) {

	$('svg').html('');

	month = data.healthData[date],
	bpVis = d3.select("#bp-visualization"),
	width = parseInt(d3.select('.graph').style('width'), 10),
	height = parseInt(d3.select('.graph').style('height'), 10),
	margins = {
		top: 30,
		right: 20,
		bottom: 30,
		left: 50
	};

// Heart Rate and Blood Pressure Visualization Scales

	xScale = d3.scale.linear().range([margins.left, width - margins.right])
		.domain([d3.min(month, function(d) {
			return d.day;
		}), d3.max(month, function(d) {
			return d.day;
		})]);

	yScaleBP = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.bpmorning.diastolic - 20;
		}), d3.max(month, function(d) {
			return d.bpmorning.systolic + 20;
		})]);

	yScaleHR = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.heartrate - 20;
		}), d3.max(month, function(d) {
			return d.heartrate + 20;
		})]);

// Heart Rate and Blood Pressure Axes

	xAxis = d3.svg.axis()
		.scale(xScale)
		.ticks(month.length);

	yAxis = d3.svg.axis()
		.orient('left')
		.scale(yScaleBP)
		.ticks(6);

	yAxisHR = d3.svg.axis()
		.orient('left')
		.scale(yScaleHR)
		.ticks(5);

// Redraw Line Functions

	lineGenS = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleBP(d.bpmorning.systolic);
		})
		.interpolate("cardinal");

	lineGenD = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleBP(d.bpmorning.diastolic);
		})
		.interpolate("cardinal");

	lineGenHR = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleHR(d.heartrate);
		})
		.interpolate("cardinal");

// Append Axes to Graph

	bpVis.append("svg:g")
		.attr("class", "axis")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
		.call(xAxis);

	bpVis.append("svg:g")
		.attr("class", "axis")
		.attr('class', 'yAxis')
		.attr("transform", "translate(" + (margins.left) + ", 0)")
		.call(yAxis);

	hrVis.append("svg:g")
		.attr("class", "axis")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
		.call(xAxis);

	hrVis.append("svg:g")
		.attr("class", "axis")
		.attr('class', 'yAxisHR')
		.attr("transform", "translate(" + (margins.left) + ", 0)")
		.call(yAxisHR);

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

// Heart Rate and Blood Pressure Data Points

var sysPoints = bpVis.selectAll(".point")
	.data(month);
		
	sysPoints.enter().append("svg:circle")
		.attr("stroke", "#C43B73")
		.attr("fill", "#fafafa" )
		.attr('class', 'sysPoints')
		.attr("cx", function(d, i) {
			return xScale(d.day);
		})
		.attr("cy", function(d, i) {
			return yScaleBP(d.bpmorning.systolic);
		})
		.attr("r", 5)
		.on('mouseover', sysTip.show)
		.on('mouseout', sysTip.hide);

var diaPoints = bpVis.selectAll(".point")
	.data(month);

	diaPoints.enter().append("svg:circle")
		.attr("stroke", "#45B29D")
		.attr("fill", "#fafafa" )
		.attr('class', 'diaPoints')
		.attr("cx", function(d, i) {
			return xScale(d.day);
		})
		.attr("cy", function(d, i) {
			return yScaleBP(d.bpmorning.diastolic);
		})
		.attr("r", 5)
		.on('mouseover', diaTip.show)
		.on('mouseout', diaTip.hide);

var hrPoints = hrVis.selectAll(".point")
	.data(month);

	hrPoints.enter().append("svg:circle")
		.attr("stroke", "#C43B73")
		.attr("fill", "#fafafa" )
		.attr('class', 'hrPoints')
		.attr("cx", function(d, i) {
			return xScale(d.day);
		})
		.attr("cy", function(d, i) {
			return yScaleHR(d.heartrate);
		})
		.attr("r", 5)
		.on('mouseover', hrTip.show)
		.on('mouseout', hrTip.hide);

// Cholesterol Chart

	bWidth = parseInt(d3.select('.bloodwork .graph').style('width'), 10),
	bHeight = parseInt(d3.select('.bloodwork .graph').style('height'), 10),
	bMargins = {
		top: 20,
		right: 20,
		bottom: 25,
		left: 50
	};

	bmonth = data.bloodwork[date];

	cholesterol = bmonth[0];

	byScale = d3.scale.linear().range([bHeight - bMargins.top, bMargins.bottom])
		.domain([d3.min(bmonth, function(d) {
			return 0;
		}), d3.max(bmonth, function(d) {
			return bHeight - bMargins.bottom;
		})]);

// Append Bars to Graph

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
		.attr('class', 'byAxis')
		.attr("transform", "translate(" + (bMargins.left) + "," + (-15) + " )")
		.call(byAxis);

// Tryglyceride Chart

	tryglyceride = bmonth[1];

	tyScale = d3.scale.linear().range([bHeight - bMargins.top, bMargins.bottom])
	.domain([d3.min(bmonth, function(d) {
		return 0;
	}), d3.max(bmonth, function(d) {
		return bHeight - bMargins.bottom;
	})]);

// Tryglyceride Append Bars	
	
	tBars.enter().append("rect")
		.attr("x", function(d, i) {
			return 2 * (i + 1) * (bWidth / 6);
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

	tText.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			return 2 * (i + 1) * (bWidth / 6) + 25;
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
		.attr('class', 'tyAxis')
		.attr("transform", "translate(" + (bMargins.left) + "," + (-15) + ")")
		.call(byAxis);

	resize();
	}

// Resize function

function resize() {

// Resize Heart Rate & Blood Pressure Graph
	width = parseInt(d3.select('.graph').style('width'), 10);
	height = parseInt(d3.select('.graph').style('height'), 10);

	xScale.range([margins.left, width - margins.right]);
	yScaleBP.range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.bpmorning.diastolic - 20;
		}), d3.max(month, function(d) {
			return d.bpmorning.systolic + 20;
		})]);

	yScaleHR.range([height - margins.top, margins.bottom])
		.domain([d3.min(month, function(d) {
			return d.heartrate - 20;
		}), d3.max(month, function(d) {
			return d.heartrate + 20;
		})]);

	d3.selectAll('.xAxis').attr("transform", "translate(0, " + (height - margins.bottom) + ")");
	yAxis.scale(yScaleBP);
	yAxisHR.scale(yScaleHR);

	lineGenS = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleBP(d.bpmorning.systolic);
		})
		.interpolate("cardinal");

	lineGenD = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleBP(d.bpmorning.diastolic);
		})
		.interpolate("cardinal");

	lineGenHR = d3.svg.line()
		.x(function(d) {
			return xScale(d.day);
		})
		.y(function(d) {
			return yScaleHR(d.heartrate);
		})
		.interpolate("cardinal");

	d3.selectAll('circle')
		.attr('cx', function(d) {
			return xScale(d.day);
		});

	d3.selectAll('.sysPoints')
		.attr('cy', function(d) {
			return yScaleBP(d.bpmorning.systolic);
		});
	d3.selectAll('.diaPoints')
		.attr('cy', function(d) {
			return yScaleBP(d.bpmorning.diastolic);
		});
	d3.selectAll('.hrPoints')
		.attr('cy', function(d) {
			return yScaleHR(d.heartrate);
		});

	d3.select('#bp-visualization')
		.attr('width', width)
		.attr('height', height);
	d3.select('#hr-visualization')
		.attr('width', width)
		.attr('height', height);

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

	d3.select('.yAxis')
		.call(yAxis);
	d3.select('.yAxisHR')
		.call(yAxisHR);

// Resize Tryglyceride Graph

	bWidth = parseInt(d3.select('.bloodwork .graph').style('width'), 10);
	bHeight = parseInt(d3.select('.bloodwork .graph').style('height'), 10);

	byScale = d3.scale.linear().range([bHeight - bMargins.top, bMargins.bottom])
		.domain([d3.min(bmonth, function(d) {
			return 0;
		}), d3.max(bmonth, function(d) {
			return bHeight - bMargins.bottom;
		})]);

	byAxis.scale(byScale);
	
	bars.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 9);
	});
	text.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 9) + 25;
		})
		.attr("y", function(d, i) {
			return bHeight - 5;
		});

	tBars.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 6);
	});
	tText.attr("x", function(d, i) {
		return 2 * (i + 1) * (bWidth / 6) + 25;
		})
		.attr("y", function(d, i) {
			return bHeight - 5;
		});

	bars.attr("y", function(d, i) {
		return bHeight - d - bMargins.bottom;
	});

	tBars.attr("y", function(d, i) {
		return bHeight - d - bMargins.bottom;
	});

	chart.attr('width', bWidth)
		.attr('height', bHeight);
	newChart.attr('width', bWidth)
		.attr('height', bHeight);

	d3.select('.byAxis')
		.call(byAxis);
	d3.select('.tyAxis')
		.call(byAxis);

}

d3.select(window).on('resize', resize);

var yourMonth;
var yourYear;
var yourDay;

// Health data date picker
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var healthDataDate = new Date();

yourYear = healthDataDate.getFullYear();
yourMonth = healthDataDate.getMonth();
yourDay = healthDataDate.getMonth();

healthDataDate.setMonth(healthDataDate.getMonth());

$("#month").html(monthNames[yourMonth].substr(0,3));
$("#year").html(yourYear);


$(".date-picker .fa-caret-left").click(function() {
	healthDataDate.setMonth(healthDataDate.getMonth() - 1);
	yourMonth  = monthNames[healthDataDate.getMonth()].substr(0,3).toLowerCase();
	if (yourMonth == "dec") {
		healthDataDate.setFullYear(healthDataDate.getFullYear());
		yourYear = healthDataDate.getFullYear();
	}

	changeDate(yourMonth);

	$("#month").html(yourMonth);
	$("#year").html(yourYear);
});


$(".date-picker .fa-caret-right").click(function() {

	healthDataDate.setMonth(healthDataDate.getMonth() + 1);
	yourMonth = monthNames[healthDataDate.getMonth()].substr(0,3).toLowerCase();
	if (yourMonth == "jan") {
		healthDataDate.setFullYear(healthDataDate.getFullYear());
		yourYear = healthDataDate.getFullYear();
	}

	changeDate(yourMonth);
	
	$("#month").html(yourMonth);
	$("#year").html(yourYear);
});

var curDate = month[yourDay-1];

$('.bp .stats').html("<h4><span>" + curDate.bpmorning.systolic + "</span><br>" + curDate.bpmorning.diastolic + "</h4><p>mmHg</p>");
$('.hr .stats').html("<h4><span>" + curDate.heartrate + "</span>bpm</h4>");

resize();

$('.month-picker .fa').on('click', function() {
	$('.cal-popup').slideToggle();
});

var selectYear = $('#yearpick').html();
var selectMonth = monthNames[healthDataDate.getMonth()].substr(0,3).toLowerCase();

$('.arrowleft').on('click', function() {
	selectYear--;
	$('#yearpick').html(selectYear);
});

$('.arrowright').on('click', function() {
	selectYear++;
	$('#yearpick').html(selectYear);
});

$('.month').on('click', function() {
	$('.active-month').removeClass('active-month');
	$(this).addClass('active-month');
	selectMonth = $(this).attr('id');
	console.log(selectMonth);
});

$('.month-picker button').on('click', function() {
	$('#month').html(selectMonth);
	$('#year').html(selectYear);
	changeDate(selectMonth);
	$('.cal-popup').slideUp();
	$('.active-month').removeClass('active-month');
	resize();
});

$('.view-month').on('click', function() {
	window.scrollTo(0,0);
	$('.cal-popup').slideDown();
});

$(document).mouseup(function (e) {
    var container = $('.cal-popup');

    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        container.slideUp();
    }
});


$('.arrowdown').on('click', function() {
	$('.cal-popup').slideToggle();
});

})();
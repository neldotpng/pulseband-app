(function(){

var data = (function () {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': 'json/main.json',
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

// Blood Pressure Daily Graph

var bpDay = data.bpdaily['day15'],
	morning = bpDay[0],
	night = bpDay[1];

var chart = d3.select("#daily-bp"),
	width = parseInt(d3.select('.graph').style('width'), 10),
	height = parseInt(d3.select('.graph').style('height'), 10),
	margins = {
		top: 20,
		right: 20,
		bottom: 25,
		left: 50
	},

	yScale = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(bpDay, function(d) {
			return 0;
		}), d3.max(bpDay, function(d) {
			return height - margins.bottom;
		})]);

	chart.attr("width", width)
		.attr("height", height);

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong class='systolic'>Systolic</strong> | <strong class='diastolic'>Diastolic</strong><br><span>" + d + " mmHg</span>";
	});

chart.call(tip);

var bars = chart.selectAll("rect")
	.data(morning);

var nBars = chart.selectAll("rect")
	.data(night);

// Morning Bars
bars.enter().append("rect")
	.attr("x", function(d, i) {
		return (i + 1) * (width / 6);
	})
	.attr("y", function(d, i) {
		return height - d - margins.bottom;
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
	return height - d - margins.bottom;
	})
	.attr("height", function(d) {
		return d;
	});

// Night Bars
nBars.enter().append("rect")
	.attr("x", function(d, i) {
		return (i + 2) * (width / 6) + (width / 3.5);
	})
	.attr("y", function(d, i) {
		return height - d - margins.bottom;
	})
	.attr("width", 50)
	.attr("height", function(d) {
		return d;
	})
	.attr("fill", "#C43B73")
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);

nBars.exit().remove();

nBars.attr("y", function(d, i) {
	return height - d - margins.bottom;
	})
	.attr("height", function(d) {
		return d;
	});

// X-Axis
var mChart = chart.selectAll("text")
	.data(morning);
	
mChart.enter()
	.append("text")
	.attr("text-anchor", "middle")
	.attr("x", function(d, i) {
		return (width / 6) + 25 + (width / 12);
	})
	.attr("y", function(d, i) {
		return height - 5;
	});

chart.select('#daily-bp text:nth-child(5)')
	.text("MORNING");

chart.select('#daily-bp text:nth-child(6)')
	.attr("x", function(d) {
		return 2 * (width / 6) + (width / 3.5) + 25 + (width / 12);
	})
	.text("NIGHT");

// Y-Axis
var yAxis = d3.svg.axis()
	.orient('left')
	.scale(yScale)
	.ticks(5);

chart.append("svg:g")
	.attr("class", "axis")
	.attr("class", "yAxis")
	.attr("transform", "translate(" + (margins.left) + "," + (-15) + " )")
	.call(yAxis);

// Heart Rate Daily Graph
var hrDay = data.hrdaily['day15'],
	hrChart = d3.select('#daily-hr'),
	hrScale = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(hrDay, function(d) {
			return d.heartrate - 10;
		}), d3.max(hrDay, function(d) {
			return d.heartrate + 10;
		})]),

	xScaleAxis = d3.scale.ordinal().rangePoints([margins.left, width - margins.right])
		.domain(["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"]),

	xScale = d3.scale.linear().range([margins.left, width - margins.right])
		.domain([d3.min(hrDay, function(d) {
			return d.block;
		}), d3.max(hrDay, function(d) {
			return d.block;
		})]);

hrChart.attr("width", width)
	.attr("height", height);

// Heart Rate Define Axes

var xAxis = d3.svg.axis()
		.scale(xScaleAxis)
		.ticks(hrDay.length),

	hrAxis = d3.svg.axis()
		.orient('left')
		.scale(hrScale)
		.ticks(4);

// Append Axes

hrChart.append("svg:g")
	.attr("class", "axis")
	.attr("class", "xAxis")
	.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
	.call(xAxis);

hrChart.append("svg:g")
	.attr("class", "axis")
	.attr("class", "hrAxis")
	.attr("transform", "translate(" + (margins.left) + ", 0)")
	.call(hrAxis);

// Heart Rate Line Function
var lineGen = d3.svg.line()
	.x(function(d, i) {
		return xScale(d.block);
	})
	.y(function(d) {
		return hrScale(d.heartrate);
	})
	.interpolate("cardinal");

hrChart.append('svg:path')
	.attr('d', lineGen(hrDay))
	.attr('class', "path-0")
	.attr('stroke-width', 2)
	.attr('fill', 'none');

// Heart Rate Tips
var hrTip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return "<strong>Heart Rate:</strong> <span class='tip'>" + d.heartrate + " BPM</span>";
	}
);

hrChart.call(hrTip);

points = hrChart.selectAll("circle")
	.data(hrDay)
	.enter().append("svg:circle")
	.attr("stroke", "#C43B73")
	.attr("fill", "#fafafa" )
	.attr("cx", function(d, i) {
		return xScale(d.block);
	})
	.attr("cy", function(d, i) {
		return hrScale(d.heartrate);
	})
	.attr("r", 5)
	.on('mouseover', hrTip.show)
	.on('mouseout', hrTip.hide);


// Change Date Function

function changeDay(date) {
	$('svg').html('');

	bpDay = data.bpdaily['day' + date],
	morning = bpDay[0],
	night = bpDay[1];

	width = parseInt(d3.select('.graph').style('width'), 10),
	height = parseInt(d3.select('.graph').style('height'), 10),
	margins = {
		top: 20,
		right: 20,
		bottom: 25,
		left: 50
	},

	yScale = d3.scale.linear().range([height - margins.top, margins.bottom])
		.domain([d3.min(bpDay, function(d) {
			return 0;
		}), d3.max(bpDay, function(d) {
			return height - margins.bottom;
		})]);

	chart.attr("width", width)
		.attr("height", height);

	bars = chart.selectAll("rect")
		.data(morning);

	nBars = chart.selectAll("rect")
		.data(night);

// Morning Bars
	bars.enter().append("rect")
		.attr("x", function(d, i) {
			return (i + 1) * (width / 6);
		})
		.attr("y", function(d, i) {
			return height - d - margins.bottom;
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
		return height - d - margins.bottom;
		})
		.attr("height", function(d) {
			return d;
		});

// Night Bars
	nBars.enter().append("rect")
		.attr("x", function(d, i) {
			return (i + 2) * (width / 6) + (width / 3.5);
		})
		.attr("y", function(d, i) {
			return height - d - margins.bottom;
		})
		.attr("width", 50)
		.attr("height", function(d) {
			return d;
		})
		.attr("fill", "#C43B73")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	nBars.exit().remove();

	nBars.attr("y", function(d, i) {
		return height - d - margins.bottom;
		})
		.attr("height", function(d) {
			return d;
		});

// X-Axis
	mChart = chart.selectAll("text")
		.data(morning);
	
	mChart.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			return (width / 6) + 25 + (width / 12);
		})
		.attr("y", function(d, i) {
			return height - 5;
		});

	chart.select('#daily-bp text:nth-child(5)')
		.text("MORNING");

	chart.select('#daily-bp text:nth-child(6)')
		.attr("x", function(d) {
			return 2 * (width / 6) + (width / 3.5) + 25 + (width / 12);
		})
		.text("NIGHT");

// Y-Axis
	var yAxis = d3.svg.axis()
		.orient('left')
		.scale(yScale)
		.ticks(5);

	chart.append("svg:g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (margins.left) + "," + (-15) + " )")
		.call(yAxis);

// Heart Rate Daily Graph
		hrDay = data.hrdaily['day' + date],
		hrChart = d3.select('#daily-hr'),
		hrScale = d3.scale.linear().range([height - margins.top, margins.bottom])
			.domain([d3.min(hrDay, function(d) {
				return d.heartrate - 10;
			}), d3.max(hrDay, function(d) {
				return d.heartrate + 10;
			})]),

		xScaleAxis = d3.scale.ordinal().rangePoints([margins.left, width - margins.right])
			.domain(["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"]),

		xScale = d3.scale.linear().range([margins.left, width - margins.right])
			.domain([d3.min(hrDay, function(d) {
				return d.block;
			}), d3.max(hrDay, function(d) {
				return d.block;
			})]);

	hrChart.attr("width", width)
		.attr("height", height);

// Heart Rate Define Axes

	var xAxis = d3.svg.axis()
			.scale(xScaleAxis)
			.ticks(hrDay.length),

		hrAxis = d3.svg.axis()
			.orient('left')
			.scale(hrScale)
			.ticks(4);

// Append Axes

	hrChart.append("svg:g")
		.attr("class", "axis")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
		.call(xAxis);

	hrChart.append("svg:g")
		.attr("class", "axis")
		.attr("class", "hrAxis")
		.attr("transform", "translate(" + (margins.left) + ", -15)")
		.call(hrAxis);

	hrChart.append('svg:path')
		.attr('d', lineGen(hrDay))
		.attr('class', "path-0")
		.attr('stroke-width', 2)
		.attr('fill', 'none');

// Heart Rate Tips
	var hrTip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Heart Rate:</strong> <span class='tip'>" + d.heartrate + " BPM</span>";
		}
	);

	hrChart.call(hrTip);

	points = hrChart.selectAll("circle")
		.data(hrDay)
		.enter().append("svg:circle")
		.attr("stroke", "#C43B73")
		.attr("fill", "#fafafa" )
		.attr("cx", function(d, i) {
			return xScale(d.block);
		})
		.attr("cy", function(d, i) {
			return hrScale(d.heartrate);
		})
		.attr("r", 5)
		.on('mouseover', hrTip.show)
		.on('mouseout', hrTip.hide);

	$('.bp .stats').html("<h4><span>" + night[0] + "</span><br>" + night[1] + "</h4><p>mmHg</p>");
	$('.hr .stats').html("<h4><span>" + hrDay[5].heartrate + "</span>bpm</h4>");
	}

// Resize Function
// Resizes based on browser width and redraws according to .graph size

function resize() {

// Resize Heart Rate Graph

	width = parseInt(d3.select('.graph').style('width'), 10);
	height = parseInt(d3.select('.graph').style('height'), 10);

	xScaleAxis.rangePoints([margins.left, width - margins.right]);
	xScale.range([margins.left, width - margins.right]);
	hrScale.range([height - margins.top, margins.bottom]);

	d3.selectAll('circle')
		.attr('cx', function(d, i) {
			return xScale(d.block);
		})
		.attr('cy', function(d, i) {
			return hrScale(d.heartrate);
		});

	d3.select('#daily-hr')
		.attr('width', width)
		.attr('height', height);

	d3.select('.path-0')
		.attr('d', lineGen(hrDay));

	xAxis.scale(xScaleAxis);
	hrAxis.scale(hrScale);

	d3.select('.xAxis')
		.attr("transform", "translate(0, " + (height - margins.bottom) + ")")
		.call(xAxis);

	d3.select('.hrAxis')
		.call(hrAxis);

// Resize Blood Pressure Graph
	yScale.range([height - margins.top, margins.bottom]);

	d3.select('#daily-bp')
		.attr('width', width)
		.attr('height', height);

	bars.attr("x", function(d, i) {
		return (i + 1) * (width / 6);
		})
		.attr("y", function(d, i) {
			return height - d - margins.bottom;
		});
	nBars.attr("x", function(d, i) {
			return (i + 2) * (width / 6) + (width / 3.5);
		})
		.attr("y", function(d, i) {
			return height - d - margins.bottom;
		});

	mChart.attr("x", function(d, i) {
			return (width / 6) + 25 + (width / 12);
		})
		.attr("y", function(d, i) {
			return height - 5;
		});
	chart.select('#daily-bp text:nth-child(6)')
		.attr("x", function(d) {
			return 2 * (width / 6) + (width / 3.5) + 25 + (width / 12);
		})
		.attr("y", function(d, i) {
			return height - 5;
		});

	d3.select('.yAxis')
		.call(yAxis);
}

d3.select(window).on('resize', resize);


// DBDATE.JS
// Date Adjustment Function
// defines Today's date
//
// 
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var date = new Date();
var month = date.getMonth();
//Reduces months to three letters
var shortMonth = monthNames[month].substr(0,3);
var day = date.getDate();

//Auto-updates today's date
$(".date-picker h4").html( shortMonth + " " + day);

//Increments date 
$(".date-picker .arrow-right").click(function() {
	date.setDate(date.getDate()+1);
	var tomorrow = date.toString().split(" ");
	var tomMonth = tomorrow[1];
	var tomDay = tomorrow[2];

	if (tomDay.toString().charAt(0) == "0") {
		tomDay = tomDay.charAt(1);
		changeDay(tomDay);
	} else {
		changeDay(tomDay);
	}
	$(".date-picker h4").html(tomMonth + " " + tomDay);

});

//Decrements date
$(".date-picker .arrow-left").click(function() {
	
	date.setDate(date.getDate()-1);
	var yesterday = date.toString().split(" ");
	var yesMonth = yesterday[1];
	var yesDay = yesterday[2];

	if (yesDay.toString().charAt(0) == "0") {
		yesDay = yesDay.charAt(1);
		changeDay(yesDay);
	} else {
		changeDay(yesDay);
	}

	$(".date-picker h4").html(yesMonth + " " + yesDay);

});

//Parses YYYY-MM-DD format
var parsedMonth;
var yourYear;
var yourMonth;
var yourDay;

function parseDate(yourDate) {
   parsedMonth = yourDate.split("-"); 
   yourYear = parsedMonth[0];
   yourMonth = parsedMonth[1];
   yourDay = parsedMonth[2];
};



//finds month name from default format MM
var namedMonth;

function findMonth(monthNum) {
	
	if (monthNum.toString().charAt(0) == "0") {
		monthNum = monthNum.charAt(1) - 1;
	}
	else {
		monthNum -= 1;
	}
	
	namedMonth = monthNames[monthNum];
}

//Click the Calendar icon to slide down the Date Picker Pop up

$(".date-icon .fa-calendar").click(function() {
	$(".date-popup").slideDown();
	$(".overlay").show();
	$(".overlay").css("opacity", "0");
	$(".overlay").on("click", function() {
		$(".date-popup").hide();
		$(".overlay").hide();
		$(".overlay").css("opacity", "0.5");
	})


});

//Click the calendar icon or X icon to slide up Date Picker Pop Up
$(".date-popup .fa, .date-popup a").click(function(){
	$(".date-popup").slideUp();
	$(".overlay").hide();
	
});

//Click GO to update the Date object

$(".full a").click(function() {

	parseDate($(".date-popup .date").val());
	findMonth(yourMonth);

	if (yourDay.toString().charAt(0) == "0") {
		yourDay = yourDay.charAt(1);
		changeDay(yourDay);
	} else {
		changeDay(yourDay);
	}

	$(".greeting .date-picker h4").html( namedMonth.substr(0,3) + " " + yourDay);

	var chosenDate = new Date(yourYear, yourMonth, yourDay);
	
	var diffDays = chosenDate.getDate() - date.getDate();
	
	date.setDate(date.getDate() + diffDays); 
	
	

});

//MOBILE VERSION of date picker functionality 

//Click the calendar drop down for the date picker to slide down

$(".arrow-mobile").click(function() {
	$(".date-popup-mobile").slideDown();
});

//Click GO to update the Date object

$(".date-popup-mobile a").click(function() {
	parseDate($(".date-popup-mobile .date").val());
	findMonth(yourMonth);

	if (yourDay.toString().charAt(0) == "0") {
		yourDay = yourDay.charAt(1);
		changeDay(yourDay);
	} else {
		changeDay(yourDay);
	}
	$(".date-picker h4").html(namedMonth.substr(0,3) + " " + yourDay);
	

	var chosenDate = new Date(yourYear, yourMonth, yourDay);
	
	var diffDays = chosenDate.getDate() - date.getDate();
	
	date.setDate(date.getDate() + diffDays);

});

$('.bp .stats').html("<h4><span>" + night[0] + "</span><br>" + night[1] + "</h4><p>mmHg</p>");
$('.hr .stats').html("<h4><span>" + hrDay[5].heartrate + "</span>bpm</h4>");
}());
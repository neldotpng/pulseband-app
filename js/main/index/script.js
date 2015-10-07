$(".leftbar li a").click(function() {
	$(".d3-tip").remove();
});

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var hour;
var minutes;
function parseTime(time) {
	var parsedTime = time.split(":");
	hour = parsedTime[0];
	minutes = parsedTime[1];
}
//alters time format from military to default hh:mm AM/PM
var meridiem;
function addMeridiem(hour) {
	if (hour > 11) {
		meridiem = "PM";

	}
	else  {
		meridiem = "AM";
	}
}

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


function findMonthNum(month) {
	if (month == "January") {
		return "01";
	}
	else if (month == "February") {
		return "02";
	}
	else if (month == "March") {
		return "03";
	}
	else if (month == "April") {
		return "04";
	}
	else if (month == "May") {
		return "05";
	}
	else if (month == "June") {
		return "06";
	}
	else if (month == "July") {
		return "07";
	}
	else if (month == "August") {
		return "08";
	}
	else if (month == "September") {
		return "09";
	}
	else if (month == "October") {
		return "10";
	}
	else if (month == "November") {
		return "11";
	}
	else if (month == "December") {
		return "12";
	}
}
function rightBarFunctionality() {
		$(".rightbar").on('click', 'li', function() {
			var browserWidth = $(window).width();
			//no mouseover functionality on mobileview
			if (browserWidth > 640) {

				$(this).find(".options").slideDown().delay(200);
			}

		})

		$(".rightbar").on('mouseleave', 'li', function() {
			var browserWidth = $(window).width();

			if (browserWidth > 640) {
				$(this).find(".options").slideUp().delay(200);
			}

		})

		$(window).resize(function() {
			var browserWidth = $(window).width();
			if (browserWidth < 641) {
				$(".rightbar li .options").css("display", "inline-block");
			}
			else {
				$(".rightbar li .options").hide();
			}
		})


		// //Completing a task

		$(".rightbar").on('click', 'li .options .fa-check-circle', function () {

			$(this).parentsUntil("ul").animate({backgroundColor: "#45b29d",
			color : "#fafafa" });
			$(this).parentsUntil("ul").html("<h1>Completed!</h1>");
			$(".rightbar h1").parent().delay(500).fadeOut(500, function() {
				$(".rightbar h1").parent().remove();
			});

		})


		var list;
		$(".rightbar").on('click',  'li .options .fa-pencil-square-o', function() {
			$(".edit-reminder form")[0].reset();
			$(".edit-reminder").show();
			$(".overlay").show();
			$(".input-location").show();
			$(".input-location").prev().show();
			$(".input-location").attr("disabled", false);

	
			list = $(this).parentsUntil("ul");
			if ($(list).parent().hasClass("task")) {
				$(".input-location").hide();
				$(".input-location").prev().hide();
				$(".input-location").attr("disabled", true);
			}

			var reminder = $(this).parentsUntil("ul").children("p").text();
			
			var separators = [',', '-', ' at '];
			var reminderParse = reminder.split(new RegExp(separators.join('|')));

			var reminderDate = reminderParse[0];
			var reminderDateParse = reminderDate.split(" ");
			var reminderMonth = reminderDateParse[0];
			reminderMonth = findMonthNum(reminderMonth);
			var currYear = "2015";
			var monthFormat = currYear + "-" + reminderMonth + "-" + reminderDateParse[1];
			console.log(reminderMonth);
			var reminderTime = reminderParse[1];
			var reminderTimeParse = reminderTime.split(" ");
			var reminderTimeOnly = reminderTimeParse[1];


			if (reminderTimeOnly.length < 5) {
				reminderTimeOnly = "0" + reminderTimeOnly;
			}
			var reminderTitle = reminderParse[2];
			var reminderLocation = reminderParse[3];

			$(".edit-reminder .input-title").attr("value", reminderTitle);
			$(".edit-reminder .input-location").attr("value", reminderLocation);
			$(".edit-reminder .input-date").attr("value", monthFormat);
			$(".edit-reminder .input-time").val(reminderTimeOnly + ":00");
			$(".edit-reminder .delete").click(function() {
				list.remove();
				$("reminder-deleted").fadeIn().delay(500);
				$("reminder-deleted").fadeOut()
			})

			
			$(".edit-reminder .confirm").click(function() {
				var subTime;
				if ($(".input-time").val().charAt(0) == '0') {
					subTime = $(".input-time").val().substr(1, 5);
				}
				else {
					subTime = $(".input-time").val();
				}
				parseTime(subTime);
				addMeridiem(hour);
				parseDate($(".input-date").val());
				findMonth(yourMonth);

				if (hour > 12) {
					hour -= 12;
				}

				if ($(list).parent().hasClass("task")) {
					$(list).find("#task-date").text(namedMonth + " " + yourDay);
					$(list).find("#task-time").text(hour + ":" + minutes + " " + meridiem);
					$(list).find("#task-do").text($(".input-title").val());

				}
				if ($(list).parent().hasClass("apt")) {
					$(list).find("#apt-date").text(namedMonth + " " + yourDay);
					$(list).find("#apt-time").text(hour + ":" + minutes + " " + meridiem);
					$(list).find("#apt-title").text($(".input-title").val());
					$(list).find("#apt-loc").text($(".input-location").val());

				}
				

				if ($(".input-title").val().length > 0
					&& $(".input-date").val().length && $(".input-time").val().length) {
						$(".edit-reminder").fadeOut();
						$(".overlay").hide();
						$(".reminder-edited").fadeIn(500).delay(1000).fadeOut(500);
				}

				
					
				
			})
		})
};

//Call the function
rightBarFunctionality();




//Add Reminder tabs

$("#tab1").click(function() {
	$(this).addClass("active");
	$("#tab2").removeClass("active");
	$("#tab-content1").show();
	$("#tab-content2").hide();


});

$("#tab2").click(function() {
	$(this).addClass("active");
	$("#tab1").removeClass("active");
	$("#tab-content2").show();
	$("#tab-content1").hide(); 
});

$("#add-task").click(function() {
	$("#tab1").addClass("active");
	$("#tab2").removeClass("active");
	$("#tab-content1").show();
	$("#tab-content2").hide();
});

$("#add-apt").click(function() {
	$("#tab2").addClass("active");
	$("#tab1").removeClass("active");
	$("#tab-content2").show();
	$("#tab-content1").hide(); 
});







$(".rightbar .add-reminder").click(function() {
	$(".reminder-popup").show();
	$(".overlay").show();

	$("#task-form")[0].reset();

	$("#apt-form")[0].reset();
});

$(".reminder-popup .fa").click(function() {
	$(".reminder-popup").fadeOut();
	$(".overlay").fadeOut();
})







//append a task

$(".reminder-popup .tabs .task .submit").click(function() {
	var titleResponse = $(this).siblings(".title").val();
	var dateResponse = $(this).siblings(".date").val();
	parseDate(dateResponse); 
	findMonth(yourMonth);
	var timeResponse = $(this).siblings(".time").val();

	parseTime(timeResponse);
	addMeridiem(hour);

	if (hour > 12) {
		hour -= 12;
	}

	$(".reminders").append("<li><p><span><span id='task-date'>" + 
		namedMonth + " " + yourDay + "</span>, <span id='task-time'>" + hour + ":" + minutes + " " + meridiem + "</span> -</span><br>" + 
			"<span id='task-do'>" + titleResponse + "</span></p>" + 
			"<div class='options'><i class='fa fa-pencil-square-o'></i>" + 
			"<i class='fa fa-check-circle'></i></div></li>");

	$(".reminder-popup").fadeOut();
	$(".overlay").fadeOut();
	$(".reminder-added").fadeIn(500).delay(1000).fadeOut(500);

	rightBarFunctionality();

	
});

//append an appointment

$(".reminder-popup .tabs .apt .submit").click(function() {
	var titleResponse = $(this).siblings(".title").val();
	var locationResponse = $(this).siblings(".location").val();
	var dateResponse = $(this).siblings(".date").val();
	parseDate(dateResponse); 
	findMonth(yourMonth);
	var timeResponse = $(this).siblings(".time").val();
	
	parseTime(timeResponse);
	addMeridiem(hour);

	if (hour > 12) {
		hour -= 12;
	}

	$(".appointments").append("<li><p><span><span id='apt-date'>" + 
			namedMonth + " " + yourDay + "</span>, <span id='apt-time'>" + hour + ":" + minutes + " " + meridiem + "</span> -</span><br>" + 
			"<span id='apt-title'>" + titleResponse + "</span> at  <span id='apt-loc'>" + locationResponse + "</span></p>" + 
			"<div class='options'><i class='fa fa-pencil-square-o'></i>" + 
			"<i class='fa fa-check-circle'></i></div></li>");


	$(".reminder-popup").fadeOut();
	$(".overlay").fadeOut();
	
	rightBarFunctionality();
});

//EDIT REMINDER
$(".edit-reminder .fa-times, .delete").click(function() {
	$(".edit-reminder").fadeOut();
	$(".overlay").hide();
	
});

$(".edit-reminder .confirm").click(function() {
	
});

$(".edit-reminder .delete").click(function() {
	$(".reminder-deleted").fadeIn(500).delay(1000).fadeOut(500);
});


//------------RIGHTBAR ------------------



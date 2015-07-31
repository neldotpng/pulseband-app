
//left bar active states

$('.leftbar ul li').click(function() {
	
	$(this).addClass("active")
			.siblings().removeClass("active");
});

$('.leftbar ul li a').click(function() {
	$(this).parent().addClass("active");
	$(this).parent().siblings().removeClass("active");
});


$(window).resize(function() {
	var browserWidth = $(window).width();

	if (browserWidth > 1024) {
		$(".leftbar").show();
		$(".rightbar").show();
	}
});


$(".menu_div").click(function() {
	var browserWidth = $(window).width();

	if (browserWidth <= 1024) {
		if ($(".leftbar").is(":visible")) {
			$(".leftbar").hide("slide", {direction: "left"}, 300);
			$("#menu-toggle").removeClass("active");
		}
		else {
			$("#menu-toggle").addClass("active");
			$(".leftbar").show("slide", {direction: "left"}, 300);
			$(".rightbar").hide("slide", {direction: "right"}, 300);
		}
	
	}
	else {
		$(".leftbar").show();
	}
});


// leftbar
$('.reminder-toggle').click(function() {
	var browserWidth = $(window).width();
		if (browserWidth <= 1024) {
			if ($(".rightbar").is(":visible")) {
				$(".rightbar").hide("slide", {direction: "right"}, 300);
		}
		else {
			$(".rightbar").show("slide", {direction: "right"}, 300);
			$(".leftbar").hide("slide", {direction: "left"}, 300);
			$("#menu-toggle").removeClass("active");
		}
	}

});


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

$(".date-icon .fa").click(function() {
	$(".date-popup").slideDown();

});


$(".date-popup .fa, .date-popup a").click(function(){
	$(".date-popup").slideUp();
	
});







//notifications

$(".topbar .notification").click(function() {
	if ($(".notif").is(":visible")) {
		$(".notif").hide();
	}
	else {
		$(".notif").show();
	}
	
});

//hide the notifications popup when window minimizes to 768px
$(window).resize(function() {
	if ($(window).width() < 769) {
		if ($(".notif").is(":visible")) {
			$(".notif").hide();
		}
	}
})

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


function rightBarFunctionality() {
		$(".rightbar li").click(function() {
			var browserWidth = $(window).width();
			//no mouseover functionality on mobileview
			if (browserWidth > 640) {

				$(this).find(".options").slideDown().delay(200);
			}
			
		})

		$(".rightbar li").mouseleave(function() {
			var browserWidth = $(window).width();

			if (browserWidth > 640) {
				$(this).find(".options").slideUp().delay(200);
			}
			
		})

		//Completing a task

		$(".rightbar li .options .fa-check-circle").click(function () {

			$(this).parentsUntil("ul").animate({backgroundColor: "#45b29d",
			color : "#fafafa" });
			$(this).parentsUntil("ul").html("<h1>Completed!</h1>");
			$(".rightbar h1").parent().delay(500).fadeOut(500);

			

		})

		$(".rightbar li .options .fa-pencil-square-o").click(function() {
			$(".edit-reminder").show();
			$(".overlay").show();
			$(".edit-reminder input").hide();
			var list = $(this).parentsUntil("ul");
			var reminder = $(this).parentsUntil("ul").children("p").text();
			
			var separators = [',', '-', ' at '];
			var reminderParse = reminder.split(new RegExp(separators.join('|')));

			var reminderDate = reminderParse[0];
			var reminderTime = reminderParse[1];
			var reminderTitle = reminderParse[2];
			var reminderLocation = reminderParse[3];

			$(".edit-reminder .title").text(reminderTitle);
			$(".edit-reminder .location").text(reminderLocation);
			$(".edit-reminder .date").text(reminderDate);
			$(".edit-reminder .time").text(reminderTime);

			$(".edit-reminder .delete").click(function() {
				list.remove();
				$("reminder-deleted").fadeIn().delay(500);
				$("reminder-deleted").fadeOut()
			})

			// $(".edit-reminder .confirm").click(function() {
			// 	if ($(".input-title").val()) {

			// 	}
			// })
		})

		$(".edit-reminder h3 .edit-title").click(function() {
			$(".edit-reminder .input-title").slideDown(200);
		})

		$(".edit-reminder h3 .edit-location").click(function() {
			$(".edit-reminder .input-location").slideDown(200);
		})
		$(".edit-reminder h3 .edit-date").click(function() {
			$(".edit-reminder .input-date").slideDown(200);
		})
		$(".edit-reminder h3 .edit-time").click(function() {
			$(".edit-reminder .input-time").slideDown(200);
		})



};

//Call the function
rightBarFunctionality();



//append a task

$(".reminder-popup .tabs .task .submit").click(function() {
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

	$(".reminders").append("<li><p><span>" + 
		namedMonth + " " + yourDay + ", " + hour + ":" + minutes + " " + meridiem + " -</span><br>" + 
			titleResponse + " at " + locationResponse + "</p>" + 
			"<div class='options'><i class='fa fa-pencil-square-o'></i>" + 
			"<i class='fa fa-check-circle'></i></div></li>");

	$(".reminder-popup").fadeOut();
	$(".overlay").fadeOut();


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

	$(".appointments").append("<li><p><span>" + 
			namedMonth + " " + yourDay + ", " + hour + ":" + minutes + " " + meridiem + " -</span><br>" + 
			titleResponse + " at " + locationResponse + "</p>" + 
			"<div class='options'><i class='fa fa-pencil-square-o'></i>" + 
			"<i class='fa fa-check-circle'></i></div></li>");


	$(".reminder-popup").fadeOut();
	$(".overlay").fadeOut();
	
	rightBarFunctionality();
});

//EDIT REMINDER
$(".edit-reminder .fa-times, .delete, .confirm").click(function() {
	$(".edit-reminder").fadeOut();
	$(".overlay").hide();
});

//------------RIGHTBAR ------------------


//date picker
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date();
$(".date-picker .fa-caret-left").click(function() {
	date.setMonth(date.getMonth() - 1);
	yourMonth  = monthNames[date.getMonth()].substr(0,3);
	$(".date-picker h2").html(yourMonth);
});


$(".date-picker .fa-caret-right").click(function() {
	date.setMonth(date.getMonth() + 1);
	yourMonth = monthNames[date.getMonth()].substr(0,3);
	$(".date-picker h2").html(yourMonth);

});

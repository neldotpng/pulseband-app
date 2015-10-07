
//Menu icon functionality
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


//Reminder Icon functionality
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


//notifications functionality

$(".topbar .notification").click(function() {
	if ($(".notif").is(":visible")) {
		$(".notif").hide();
		$(".overlay").hide();

	}
	else {
		$(".reddot").css("opacity", "0");
		$(".notif").show();
		$(".overlay").show();
		$(".overlay").css("opacity", "0");
		$(".overlay").on("click", function() {
			$(".notif").hide();
			$(".overlay").hide();
			$(".overlay").css("opacity", "0.5");
		})
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


//update the number of new notifications
var count = 0;

$.getJSON("json/main.json", function(data) {
	
	for (var i in data.notifications) {
		if (data.notifications[i].datetype == 'new') {
			count++;
		}
	}

	$(".reddot h2").text(count);


});










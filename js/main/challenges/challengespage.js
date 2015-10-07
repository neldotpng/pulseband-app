$("#challenges").parent().addClass("active");
$("#challenges").parent().siblings().removeClass("active");




$(".challenge-full").on("click", ".exercise-title", function() {
	
	if ($(this).next().is(":visible")) {
		$(this).next().slideUp();
		$(".exercise li div").slideUp();

	}
	else {
		$(this).next().slideDown();
		$(".diet").slideUp();
		$(".diet li div").slideUp();
	}	
});

$(".challenge-full").on("click", ".diet-title", function() {
	
	if ($(this).next().is(":visible")) {
		$(this).next().slideUp();
		$(".diet li div").slideUp();

	}
	else {
		$(this).next().slideDown();

		$(".exercise").slideUp();
		$(".exercise li div").slideUp();
	}	
});

$(".challenge-full").on("click", "div ul li", function() {
	if ($(this).children("div").is(":visible")) {
		$(this).children("div").slideUp();
	}
	else {
		$(this).children("div").slideDown();
	}

});






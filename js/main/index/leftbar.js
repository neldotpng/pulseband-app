
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
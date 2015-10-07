$("#dashboard").parent().addClass("active");
$("#dashboard").parent().siblings().removeClass("active");


$(".leftbar li").on("click", function() {
	window.scrollTo(0,0);
});

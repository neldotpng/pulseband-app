
$("#preferences").parent().addClass("active");
$("#preferences").parent().siblings().removeClass("active");
		
//Preferences

$("[name='my-checkbox']").bootstrapSwitch();

$(".preferences").on("click", "#pref-acc-heading", function() {
	$(this).css("background-color", "#c43b73");
	$(this).siblings().css("background-color", "#334D5C");	
	$(".pref-acc").show();
	$(".pref-notif, .pref-priv").hide();
})

$(".preferences").on("click", "#pref-notif-heading", function() {
	$(this).css("background-color", "#c43b73");
	$(this).siblings().css("background-color", "#334D5C");	
	$(".pref-notif").show();
	$(".pref-acc, .pref-priv").hide();
})

$(".preferences").on("click", "#pref-priv-heading", function() {
	$(this).css("background-color", "#c43b73");
	$(this).siblings().css("background-color", "#334D5C");
	$(".pref-priv").show();
	$(".pref-acc, .pref-notif").hide();
})





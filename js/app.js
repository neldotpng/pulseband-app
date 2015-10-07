var app = angular.module("PulsebandApp", ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'js/views/dashboard.html',
			controller: 'MainController'
		})
		.when('/healthdata', {
			templateUrl: 'js/views/healthdata.html',
			controller: 'MainController'
		})
		.when('/profile', {
			templateUrl: 'js/views/profile.html',
			controller: 'MainController'
		})
		.when('/preferences', {
			templateUrl: 'js/views/preferences.html',
			controller: 'MainController'
		})
		.when('/notifications', {
			templateUrl: 'js/views/notificationspage.html',
			controller: 'MainController'
		})
		.when('/challenges', {
			templateUrl: 'js/views/challengespage.html',
			controller: 'MainController'
		})
		.when('/signout', {
			templateUrl: 'js/views/signout.html',
			controller: 'MainController'
		})
		.otherwise({
			redirectTo: '/'
		});
});
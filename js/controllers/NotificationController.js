app.controller('NotificationController', ['$scope', 'data', function($scope, data) {
	data.success(function(data) {
		$scope.notifications = data.notifications;
	});
}]);
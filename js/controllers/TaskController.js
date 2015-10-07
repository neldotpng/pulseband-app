app.controller('TaskController', ['$scope', 'data', function($scope, data) {
	data.success(function(data) {
		$scope.tasks = data.reminder.tasks;
	});
}]);
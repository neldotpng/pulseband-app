app.controller('StatusController', ['$scope', 'data', function($scope, data) {
	data.success(function(data) {
		$scope.statuses = data.statuses;
	});
}]);
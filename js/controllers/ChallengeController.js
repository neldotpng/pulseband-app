app.controller('ChallengeController', ['$scope', 'data', function($scope, data) {
	data.success(function(data) {
		$scope.challenges = data.challenges;
	});
}]);
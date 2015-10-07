app.controller('AppointmentController', ['$scope', 'data', function($scope, data){
	data.success(function(data) {
		$scope.appointments = data.reminder.appointments;
	});
}]);
'use strict';

angular.module('mscApp')
.controller('suscribeCtrl', function ($scope, USER_ROLES, $location, ServiceAjax) {

  	$scope.newUser = {};

	$scope.submitSubscription = function(newUser) {
    	newUser.role = USER_ROLES.planner; //role of a standar newUser (planner)
		ServiceAjax.users().create(newUser)
			.then(function() {
				$location.path("/main");
			}, function(data) {
				console.log('Error: ' + data.data);
			});
	};
});

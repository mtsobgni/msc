'use strict';

angular.module('mscApp')
.controller('loginCtrl', function ($rootScope, $scope, FLOW_STEPS, AUTH_EVENTS, Auth, USER_ROLES, $location, ServiceAjax) {
    $scope.setStep(FLOW_STEPS.login);

  	$scope.credentials = {
  		email: '',
  		password: ''
  	};

  	$scope.submitLogin = function(credentials) {
  		Auth.login(credentials)
			.then(function(user) {
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$scope.setCurrentUser(user);

				$location.path("/myspace");
			}, function() {
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			});
	};

	$scope.submitSubscription = function(user) {
    	user.role = USER_ROLES.planner; //role of a standar user (planner)
		ServiceAjax.users().create(user)
			.then(function() {
				$location.path("/main");
			}, function(data) {
				console.log('Error: ' + data.data);
			});
	};
});

'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
.controller('MainCtrl', function ($rootScope, $scope, $location, serviceAjax) {
	if($rootScope.loggedUser) {
  		$location.path("/myspace");
  	}

	$rootScope.isSubscription = false;

  	$scope.submitLogin = function(user) {
		// submitForm("${pageContext.request.contextPath}/j_spring_security_check", "j_username", document.getElementById("username").value, "j_password", document.getElementById("password").value, "notracker", g_notracker, "nogoogletracker", g_nogoogletracker, "noannalect", g_noannalect);
		serviceAjax.users().login(user)
			.then(function(data) {
				// serviceAjax.users().get(data.data.uid)
					// .then(function(data) {
						$rootScope.loggedUser = data.data;
						$location.path("/myspace");
					// }, function(data) {
						// console.log('Error: ' + data.data);
					// });
			}, function(data) {
				console.log('Error: ' + data.data);
			});
	};

	$scope.submitSubscription = function(user) {
    	user.role = 2; //role of a standar user (planner)
		serviceAjax.users().create(user)
			.then(function(data) {
				$location.path("/main");
			}, function(data) {
				console.log('Error: ' + data.data);
			});
	};

  	$rootScope.logout = function() {
	    delete $rootScope.loggedUser;
	    $location.path("/main");
  	};
});

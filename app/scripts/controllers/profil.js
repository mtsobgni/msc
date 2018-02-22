'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
.controller('ProfilCtrl', function ($rootScope, $scope, $location, serviceAjax) {
	if(!$rootScope.loggedUser) {
        $location.path("/main");
        return;
    }
    
	$scope.isUpdate = false;
	$scope.user = $rootScope.loggedUser; 

	$scope.submitModification = function(user) {
		serviceAjax.users().update(user)
			.then(function(data) {
				$scope.isUpdate = false;
				$rootScope.loggedUser = data.data;
				$location.path("/profil");
			}, function(data) {
				console.log('Error: ' + data.data);
			});
	};

});
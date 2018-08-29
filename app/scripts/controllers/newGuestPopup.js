'use strict';

angular.module('mscApp')
.controller('newGuestPopupCtrl', function ($scope, serviceAjax, $uibModalInstance, parameters) {

	$scope.newGuest = {title: 1};
    $scope.titles = parameters.titles;

	$scope.resetGuestForm = function() {
		$scope.newGuest = {title: 1};
	};

    $scope.addGuest = function (newGuest) {
    	newGuest.evtId = parameters.eventId;
        serviceAjax.guests().create(newGuest).then(function(data) {
            newGuest = data.data;
            newGuest.key = newGuest.firstName + ' ' + newGuest.name;
            newGuest.selected = false;
            // parameters.guestList.push(newGuest);

            $scope.resetGuestForm();

        	$uibModalInstance.close(newGuest);
        }, function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});
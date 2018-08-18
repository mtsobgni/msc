'use strict';

angular.module('mscApp')
.controller('newGuestPopupCtrl', function ($scope, serviceAjax, $uibModalInstance, guestList, eventId) {

	$scope.newGuest = {title: 1};

	$scope.resetGuestForm = function() {
		$scope.newGuest = {title: 1};
	};

    $scope.addGuest = function (newGuest) {
    	newGuest.evtId = eventId;
        serviceAjax.guests().create(newGuest).then(function(data) {
            newGuest = data.data;
            newGuest.key = newGuest.firstName + ' ' + newGuest.name;
            newGuest.selected = false;
            guestList.push(newGuest);

            $scope.resetGuestForm();

        	$uibModalInstance.close('ok');
        }, function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});
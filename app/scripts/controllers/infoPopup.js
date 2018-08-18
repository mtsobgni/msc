'use strict';

angular.module('mscApp')
.controller('infoPopupCtrl', function ($scope, $uibModalInstance, event) {
    $scope.ok = function () {
        $uibModalInstance.close('ok');
    }

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});
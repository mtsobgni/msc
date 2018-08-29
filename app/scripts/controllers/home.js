'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('HomeCtrl', function ($rootScope, $scope, FLOW_STEPS, ServiceAjax, $location, Session, $routeParams, $uibModal) {
  	$scope.setStep(FLOW_STEPS.main);
    $scope.setCurrentUser();

    // var _evtId = $routeParams.evtId;
    var _evtId = Session.event();
    if(!_evtId) {
    	$location.path('/myspace');
        return;
    }
	
    $scope.isPlanView = true;

    $scope.titles = [
    	{'_id':1, 'label':'Monsieur'},
    	{'_id':2, 'label':'Madame'}
    ];

    $scope.tables = [
		{'key':1,'category':'TableR4','name':'Head 1','guests':{},'loc':'-91.50 -6.00'},
		/*{'key':2,'category':'TableR3','name':'Head 2','guests':{},'loc':'102.50 -15'},
		{'key':3,'category':'TableR8','name':'3','guests':{},'loc':'-84.5 222.50'},
		{'key':4,'category':'TableC8','name':'4','guests':{},'loc':'198.49 146.5'}*/
	];

    $scope.guests = [];
    var guestsOrigin = angular.copy($scope.guests);
    ServiceAjax.guests().all(_evtId).then(function(data) {
        var guests = data.data;
        guests.forEach(function(guest) {
        	guest.key = guest.firstName + ' ' + guest.name;
        	guest.selected = false;
        });
        $scope.guests = guests;
        guestsOrigin = angular.copy($scope.guests);
    }, function(data) {
        console.log('Error: ' + data);
    });

	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		$scope.isPlanView = $('.nav-tabs .active').text() === 'Orga Salle';
		$scope.$apply();
	});

	// trigger the selection on the dropdow "Add table"
	$('.dropdown-submenu a').on('click', function(e) {
	    $(this).next('ul').toggle();
	    e.stopPropagation();
	    e.preventDefault();
	});

	/* ******* methods ******** */

	/* ******* guest ******** */

	// add a new guest
    $scope.addGuest = function() {
	    var modalInstance = $uibModal.open({
			templateUrl: '../../views/newGuestPopup.html',
			controller: 'newGuestPopupCtrl',
			resolve: {
				parameters: function () {
					return {titles: $scope.titles, guestList: $scope.guests, eventId: _evtId};
				}
			}
		});

		modalInstance.result.then(
			function (newGuest) { //$uibModalInstance.close
			    console.log(newGuest);
			    $scope.guestList.addNodeData(newGuest);
			}, 
			function (msg) {//$uibModalInstance.dismiss
				console.log(msg);
			}
		);
	};

    $scope.deleteGuest = function(guest) {
    	ServiceAjax.guests().delete(guest._id).then(function() {
            $scope.guests.splice($scope.guests.indexOf(guest),1);
        }, function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.selectedGuests = [];
    $scope.isSelectedAllGuests = false;
    $scope.toggleAllGuests = function(isSelectedAllGuests) {
    	$scope.guests.forEach(function(guest) {
			guest.selected = isSelectedAllGuests;
    	});

    	$scope.isSelectedAllGuests = isSelectedAllGuests;
    };

	/* ******* table ******** */

    var locX = 364.5, locY = 223.5;
	var tableStd = {'key':-1, 'category':'TableC8', 'name':'4', 'guests':{}, 'loc':locX+' '+locY};
	$scope.addTable = function(tableId) {
    	var previousTables = angular.copy($scope.tables);
		tableStd.key = $scope.tables.length+1;
		tableStd.category = 'Table'+tableId;
		tableStd.name = tableStd.key + '';
		tableStd.loc = (locX + 2*tableStd.key) + ' ' + (locY + 2*tableStd.key);
		// tableStd.loc = previousTables[previousTables.length-1].loc;
		previousTables.push(angular.copy(tableStd));
		$scope.tables = previousTables;
	};

    $scope.saveModel = function() {
    	// alert('Sauvez le model');
    };

    var triggerTime = 0;
    $scope.triggerPosition = function() {
    	var model = $scope.model;
    	var data = model.findNodeDataForKey(guestsOrigin[0].key);
    	if(!data) {
    		model = $scope.guestList;
			data = model.findNodeDataForKey($scope.guests[0].key);
			if(!data) {
				return;
			}
    	}

    	triggerTime++;
		if(triggerTime === 10) {
			triggerTime = 0;
			return;
		}

    	setTimeout(function(){ model.setDataProperty(data, 'fill', 'green'); }, 100);
    	setTimeout(function(){ model.setDataProperty(data, 'fill', 'blanchedalmond'); }, 200);
    	setTimeout($scope.triggerPosition, 200);
    };

	$scope.isFullScreen = false;
	$scope.goFullScreen = function(elt) {
		$scope.isFullScreen = true;
		elt = elt || document.getElementById('myFlexDiv');
	    if (elt.mozRequestFullScreen) {
			elt.mozRequestFullScreen();
	    } else if (elt.webkitRequestFullScreen) {
			elt.webkitRequestFullScreen();
   		}
   		$scope.displayMode = 'DMBack';
		$scope.isFullScreen = false;
	};

	/* ******* watches ******** */

	$scope.$watch('guests', function(newGuests, oldGuests) {
		if (newGuests !== oldGuests) {
			$scope.guestList = new go.GraphLinksModel(newGuests);
		}
	});
	
	/*$scope.$watch(function($scope) {
		return $scope.guests.
			map(function(guest) {
				return guest.selected;
			});
	}, function(newValue) {
		if(newValue!==undefined) {
			$scope.selectedGuests = newValue.map(function (guest) {
				if(guest.selected) {
					return guest._id;
				}
			});
		}
	}, true);*/

	$scope.$watch('tables', function(newModel, oldModel) {
		if (newModel !== oldModel) {
			$scope.model = new go.GraphLinksModel(newModel);
		}
	});

    /* ******* godiagram.js  ********* */

	$scope.guestList = new go.GraphLinksModel();

	$scope.model = new go.GraphLinksModel($scope.tables);
	$scope.model.selectedNodeData = null;
	$scope.replaceModel = function() {
		$scope.model = new go.GraphLinksModel(
			[
				{ key: 11, name: 'zeta', color: 'red' },
				{ key: 12, name: 'eta', color: 'green' }
			],
			[
				{ from: 11, to: 12 }
			]
		);
	};  
});
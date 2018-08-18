'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('HomeCtrl', function ($rootScope, $scope, serviceAjax, $location, $routeParams, $uibModal) {
    if(!$rootScope.loggedUser) {
        // $location.path("/main");
    }

    var _evtId = $routeParams.evtId;
    if(!_evtId) {
    	$location.path("/space");
        return;
    }

    $scope.titles = [
    	{'_id':1, 'label':'Monsieur'},
    	{'_id':2, 'label':'Madame'}
    ];

    $scope.tables = [
		{"key":1,"category":"TableR3","name":"Head 1","guests":{},"loc":"-91.50 -6.00"},
		{"key":2,"category":"TableR3","name":"Head 2","guests":{},"loc":"102.50 -15"},
		{"key":3,"category":"TableR8","name":"3","guests":{},"loc":"-84.5 222.50"},
		{"key":4,"category":"TableC8","name":"4","guests":{},"loc":"198.49 146.5"}
	];
    $scope.isPlanView = true;

    serviceAjax.guests().all(_evtId).then(function(data) {
        var guests = data.data;
        guests.forEach(function(guest) {
        	guest.key = guest.firstName + ' ' + guest.name;
        	guest.selected = false;
        });
        $scope.guests = guests;
    }, function(data) {
        console.log('Error: ' + data);
    });

	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		$scope.isPlanView = $('.nav-tabs .active').text() === "Orga Salle";
		$scope.$apply();
	});
	
	// trigger the selection on the dropdow "Add table"
	$('.dropdown-submenu a').on("click", function(e) {
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
				guestList: function () {
				  return $scope.guests;
				},
				eventId: function () {
					return _evtId;
				}
			}
		});

		modalInstance.result.then(
			function (msg) { //$uibModalInstance.close
			    console.log(msg);
			}, 
			function (msg) {//$uibModalInstance.dismiss
				console.log(msg);
			}
		);
	};

    $scope.deleteGuest = function(guest) {
    	serviceAjax.guests().delete(guest._id).then(function(data) {
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

	// Watch guests for changes
	$scope.$watch("guests|filter:{selected:true}", function (nv) {
		if(nv!==undefined) {
			$scope.selectedGuests = nv.map(function (guest) {
				return guest._id;
			});
		}
	}, true);

	/* ******* table ******** */

    var locX = 364.5, locY = 223.5;
	var tableStd = {"key":-1, "category":"TableC8", "name":"4", "guests":{}, "loc":locX+" "+locY};
	$scope.addTable = function() {
    	var previousTables = angular.copy($scope.tables);
		tableStd.key = $scope.tables.length+1;
		tableStd.name = tableStd.key + "";
		tableStd.loc = (locX + 2*tableStd.key) + " " + (locY + 2*tableStd.key);
		// tableStd.loc = previousTables[previousTables.length-1].loc;
		previousTables.push(angular.copy(tableStd));
		$scope.tables = previousTables;
	};

    $scope.saveModel = function() {
    	// alert("Sauvez le model");
    };

    var triggerTime = 0;
    $scope.triggerPosition = function() {
    	var model = $scope.guestList;
    	var data = model.findNodeDataForKey("invite4 test");
    	if(!data) {
    		model = $scope.model;
    		data = model.findNodeDataForKey("invite4 test");
    	}
    	if(!data) {
    		return;
    	}

    	triggerTime++;
		if(triggerTime === 10) {
			triggerTime = 0;
			return;
		}

    	setTimeout(function(){ model.setDataProperty(data, "fill", "green"); }, 100);
    	setTimeout(function(){ model.setDataProperty(data, "fill", "blanchedalmond"); }, 200);
    	setTimeout($scope.triggerPosition, 200);
    };

	$scope.mySearchInFiltering = function() {
		// Declare variables 
		var input, filter, table, tr, td, i;
		input = document.getElementById("myGuestSearchInput");
		filter = input.value.toUpperCase();
		table = document.getElementById("guestTable");
		tr = table.getElementsByTagName("tr");

		// Loop through all table rows, and hide those who don't match the search query
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[1];
			if (td) {
				if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			} 
		}
	};

	$scope.isFullScreen = false;
	$scope.goFullScreen = function(elt) {
		$scope.isFullScreen = true;
		elt = elt || document.getElementById("myFlexDiv");
	    if (elt.mozRequestFullScreen) {
			elt.mozRequestFullScreen();
	    } else if (elt.webkitRequestFullScreen) {
			elt.webkitRequestFullScreen();
   		}
   		$scope.displayMode = "DMBack";
		$scope.isFullScreen = false;
	};

	/* ******* watches ******** */

	$scope.$watch("guests", function(newGuests, oldGuests) {
		if (newGuests !== oldGuests) {
			$scope.guestList = new go.GraphLinksModel(newGuests);
		}
	});

	$scope.$watch("tables", function(newModel, oldModel) {
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
				{ key: 11, name: "zeta", color: "red" },
				{ key: 12, name: "eta", color: "green" }
			],
			[
				{ from: 11, to: 12 }
			]
		);
	};  
});
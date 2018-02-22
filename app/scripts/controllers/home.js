'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('HomeCtrl', function ($rootScope, $scope, serviceAjax, $location, $routeParams) {
    if(!$rootScope.loggedUser) {
        // $location.path("/main");
    }

    var evtId = $routeParams.evtId;
    if(!evtId) {
    	$location.path("/space");
        return;
    }

    $scope.guests = [];
    $scope.tables = [
		{"key":1,"category":"TableR3","name":"Head 1","guests":{},"loc":"-91.50 -6.00"},
		{"key":2,"category":"TableR3","name":"Head 2","guests":{},"loc":"102.50 -15"},
		{"key":3,"category":"TableR8","name":"3","guests":{},"loc":"-84.5 222.50"},
		{"key":4,"category":"TableC8","name":"4","guests":{},"loc":"198.49 146.5"}
	];
    $scope.isPlanView = true;

    serviceAjax.guests().all(evtId).then(function(data) {
        $scope.guests = data.data;

        $scope.guests.forEach(function(guest) {
        	guest.key = guest.firstName + ' ' + guest.name;
        });
    }, function(data) {
        console.log('Error: ' + data);
    });

	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		$scope.isPlanView = $('.nav-tabs .active').text() === "Orga Salle";
		$scope.$apply();
	});
	
	$('.test').find('label').bind('click',  function () {
		// alert("click fired");
		// $(this).button('complete') // button text will be "finished!"
	});

	/* ******* methods ******** */

	$scope.reset = function() {
		$scope.guest = {};
	};

    $scope.addGuest = function(guest) {
    	guest.evtId = evtId;
    	var previousGuests = angular.copy($scope.guests);
        serviceAjax.guests().create(guest).then(function(data) {
            guest = data.data;
            guest.key = guest.firstName + ' ' + guest.name;
            previousGuests.push(guest);
            $scope.guests = previousGuests;

            $scope.reset(); 
        }, function(data) {
            console.log('Error: ' + data);
        });
    };

	$('.dropdown-submenu a').on("click", function(e){
	    $(this).next('ul').toggle();
	    e.stopPropagation();
	    e.preventDefault();
	  });

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
    		model = $scope.model
    		data = model.findNodeDataForKey("invite4 test");
    	}
    	if(!data) return;

    	triggerTime++;
		if(triggerTime == 10) {
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
		var elt = elt || document.getElementById("myFlexDiv");
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

	// $scope.$watch("isPlanView", function(newV, oldV) {
	// 	console.log(newV + " " + oldV);
	// }, true);

    /* ******* godiagram.js  ********* */

	$scope.guestList = new go.GraphLinksModel([
		{ key: "Tyrion Lannister" },
		{ key: "Daenerys Targaryen", plus: 3 },  // dragons, of course
		{ key: "Jon Snow" },
		{ key: "Stannis Baratheon" },
		{ key: "Arya Stark" },
		{ key: "Jorah Mormont" },
		{ key: "Sandor Clegane" },
		{ key: "Joffrey Baratheon" },
		{ key: "Brienne of Tarth" },
		{ key: "Hodor" }
		]);

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

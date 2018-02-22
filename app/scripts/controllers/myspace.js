'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:MyspaceCtrl
 * @description
 * # MyspaceCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('MyspaceCtrl', function ($rootScope, $scope, serviceAjax, $location, $filter) {
    if(!$rootScope.loggedUser) {
        $location.path("/main");
        return;
    }
    $scope.isRoomManager = $rootScope.loggedUser.role === '1'; // if it's a room's owner

    $scope.events = [];
    $scope.query = {};
    $scope.contact = {};
    $scope.queryBy = '$';
    $scope.date = new Date();

    serviceAjax.rooms().all().then(function(data) {
        $scope.rooms = data.data;
    }, function(data) {
        console.log('Error: ' + data);
    });

    serviceAjax.events().all().then(function(data) {
        var events = data.data;
        events.forEach(function(event) {
            if($scope.isRoomManager) {
                serviceAjax.rooms().get(event.where).then(function(data) {
                    var room = data.data;
                    event.where = room.name;
                    if(room.manager === $rootScope.loggedUser._id) {
                        $scope.events.push(event);
                    }
                }, function(data) {
                    console.log('Error: ' + data);
                });
            } else if(event.by === $rootScope.loggedUser._id) {
                serviceAjax.rooms().get(event.where).then(function(data) {
                    event.where = data.data.name;
                    $scope.events.push(event);
                }, function(data) {
                    console.log('Error: ' + data);
                });
            }
        });
    }, function(data) {
        console.log('Error: ' + data);
    });
    
    $scope.createEvent = function(event) {
        serviceAjax.events().create(event).then(function(data) {
            event = data.data;
            
            $scope.contact.name= $rootScope.loggedUser.name;
            $scope.contact.email= $rootScope.loggedUser.username;
            $scope.contact.msg= event._id;
            
            serviceAjax.mail().send($scope.contact).then(function(data) {
                console.log('Message envoyé ');
            })
            
            serviceAjax.rooms().get(event.where).then(function(data) {
                event.where = data.data.name;
                $scope.events.push(event);
            }, function(data) {
                console.log('Error: ' + data);
            });
        }, function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.addEvent = function(event) {
        event.by = $rootScope.loggedUser._id;
        serviceAjax.events().set(event).then(function(data) {
            event = data.data;
            if($scope.events.findIndex(function(evt) { return evt._id === event._id; }) === -1) {
                serviceAjax.rooms().get(event.where).then(function(data) {
                    event.where = data.data.name;
                    $scope.events.push(event);
                }, function(data) {
                    console.log('Error: ' + data);
                });
            }
        });
    };

    $scope.goToRoom = function(event) {
        $location.path("/home").search({"evtId": event._id});
    };

    /*****************/
    // configuration datePicker
    $scope.event = { startDate : null };
    $scope.today = function() {
        $scope.event.startDate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.event.startDate = null;
    };

    // Disable weekend selection
    function disabled(data) {
        // var date = data.date,
        // mode = data.mode;
        // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.popup = { opened: false };
    $scope.open = function() {
        $scope.popup.opened = true;
    };

    /*****************/

    $scope.inProgressEventFunction = function(event){
        var mydate = new Date();
        var eventdate = new Date(event.startDate);
        return eventdate >= mydate;
    };

    $scope.oldEventFunction = function(event){
        var mydate = new Date();
        var eventdate = new Date(event.startDate);
        return eventdate < mydate;
    };

  });

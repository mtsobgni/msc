'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:MyspaceCtrl
 * @description
 * # MyspaceCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('MyspaceCtrl', function ($scope, USER_ROLES, FLOW_STEPS, ServiceAjax, $location, $uibModal, Session) {
    $scope.setStep(FLOW_STEPS.myspace);
    $scope.setCurrentUser();

    $scope.events = [];
    $scope.EVENTSTATES = {
        ALL: 1,
        INPROGRESS: 2,
        DONE: 3
    };
    $scope.eventState = $scope.EVENTSTATES.ALL;
    
    $scope.newEvent = {};
    $scope.newEvent.startDate = new Date();
    ServiceAjax.rooms().all().then(function(data) {
        $scope.rooms = data.data;
        $scope.newEvent.where = $scope.rooms[0]._id;
    }, function(data) {
        console.log('Error: ' + data);
    });

    function fillEventsWithRooms(events) {
        events.forEach(function(event) {
            ServiceAjax.rooms().get(event.where).then(function(data) {
                event.where = data.data.name;
                $scope.events.push(event);
            }, function(data) {
                console.log('Error: ' + data);
            });
        });
    }

    if($scope.currentUser.role === USER_ROLES.owner) {
        ServiceAjax.events().getBy($scope.currentUser._id).then(function(data) {
            var events = data.data;
            fillEventsWithRooms(events);
        });
    } else {
        ServiceAjax.events().getByOnwer($scope.currentUser._id).then(function(data) {
            var events = data.data;
            fillEventsWithRooms(events);
        });
    }
    
    $scope.createEvent = function(event) {
        event.by = $scope.currentUser._id;
        ServiceAjax.events().create(event).then(function(data) {
            event = data.data;
            
            var mail = {};
            mail.contactEmail = event.bookerEmail;
            mail.contactMsg = event._id;
            mail.contactSubject = $scope.currentUser.firstName;
            
            ServiceAjax.contacts().sendMail(mail).then(function(){
                console.log('Sending done');
            
                if(event){
                    var modalInstance = $uibModal.open({
                      templateUrl: '../../views/infoPopup.html',
                      controller: 'infoPopupCtrl',
                      resolve: {
                        event: function () {
                          return event;
                        }
                      }
                    });

                    modalInstance.result.then(
                        function () { //$uibModalInstance.close
                            console.log($scope.newEvent);
                            $scope.newEvent = {};
                            $scope.newEvent.startDate = new Date();
                        }, 
                        function () {//$uibModalInstance.dismiss
                        }
                    );
                }
            });
            
            ServiceAjax.rooms().get(event.where).then(function(data) {
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
        event.owner = $scope.currentUser._id;
        ServiceAjax.events().set(event).then(function(data) {
            event = data.data;
            if($scope.events.findIndex(function(evt) { return evt._id === event._id; }) === -1) {
                ServiceAjax.rooms().get(event.where).then(function(data) {
                    event.where = data.data.name;
                    $scope.events.push(event);
                }, function(data) {
                    console.log('Error: ' + data);
                });
            }
        });
    };

    $scope.goToRoom = function(event) {
        /*if($scope.isRoomManager) {
            return;
        }*/
        Session.setEvent(event._id);
        $location.path('/home');
    };

    /*****************/

    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $scope.$apply();
    });

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
    function disabled() {
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

    $scope.sendMail = function(){
        ServiceAjax.contacts().sendMail().then(function(){
            console.log('Sending done');
        });
    };
});

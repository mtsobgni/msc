'use strict';

/**
 * @ngdoc filter
 * @name mscApp.filters
 * @description
 * # filter for the myspace page
 * Factory in the mscApp.
 */
angular.module('mscApp')
	.filter('searchedEvtFilter', function() {
		return function(events, string, eventState, EVENTSATES) {
			if(typeof events === 'undefined' || !events) {
				return [];
			}
			
            var now = new Date().toLocaleDateString();
            events = events.filter(function(event) {
            	var eventdate = new Date(event.startDate).toLocaleDateString();
            	return eventState===EVENTSATES.ALL ? true : 
            		eventState===EVENTSATES.DONE ? eventdate < now : eventdate >= now;
            });

            if(!string) {
            	return events;
            }

			var results = [];
			string = string.toLowerCase();
			angular.forEach(events, function(event) {
				if((event.name.toString().toLowerCase().indexOf(string)  !== -1) || 
					(event.where.toString().toLowerCase().indexOf(string)  !== -1) || 
					(event.startDate.toString().toLowerCase().indexOf(string) !== -1) || 
					(event.guestNumber.toString().toLowerCase().indexOf(string) !== -1)) {
					results.push(event);
				}
			});

			return results;
		};
	});
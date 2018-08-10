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
			if(typeof events === 'undefined' || !events)
				return [];
			
            var mydate = new Date();
            events = events.filter(function(event) {
            	var eventdate = new Date(event.startDate);
            	return eventState==EVENTSATES.ALL ? true : 
            		eventState==EVENTSATES.DONE ? eventdate < mydate : eventdate >= mydate;
            });

            if(!string)
            	return events;

			var results = [];
			string = string.toLowerCase();
			angular.forEach(events, function(event) {
				if((event.name.toString().toLowerCase().indexOf(string)  !== -1)
					|| (event.where.toString().toLowerCase().indexOf(string)  !== -1)
					|| (event.startDate.toString().toLowerCase().indexOf(string) !== -1)
					|| (event.guestNumber.toString().toLowerCase().indexOf(string) !== -1))
					results.push(event);
			});

			return results;
		};
	});
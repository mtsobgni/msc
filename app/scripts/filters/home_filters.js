'use strict';

/**
 * @ngdoc filter
 * @name seatingChartApp
 * @description
 * # filter for the home page
 * Factory in the seatingChartApp.
 */
angular.module('seatingChartApp')
	.filter('searchedGuestFilter', function() {
		return function(guests, string) {
            if(!string)
            	return guests;

			var results = [];
			string = string.toLowerCase();
			angular.forEach(guests, function(guest) {
				if((guest.name.toString().toLowerCase().indexOf(string)  !== -1)
					|| (guest.firstName.toString().toLowerCase().indexOf(string)  !== -1))
					results.push(guest);
			});

			return results;
		};
	});
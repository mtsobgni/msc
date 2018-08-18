'use strict';

/**
 * @ngdoc filter
 * @name mscApp.filters
 * @description
 * # filter for the home page
 * Factory in the mscApp.
 */
angular.module('mscApp')
	.filter('searchedGuestFilter', function() {
		return function(guests, string) {
            if(!string){
            	return guests;
            }

			var results = [];
			string = string.toLowerCase();
			angular.forEach(guests, function(guest) {
				if((guest.name.toString().toLowerCase().indexOf(string)!==-1)
					|| (guest.firstName.toString().toLowerCase().indexOf(string)!==-1)){
					results.push(guest);
				}
			});

			return results;
		};
	})
	.filter('labelTitleFilter', function() {
		return function(string, list) {
			var res = "";
			angular.forEach(list, function(item) {
				if(string!=undefined && string.toString()===item._id.toString()){
					res = item.label;
				}
			});
			return res;
		};
	});
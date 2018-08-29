'use strict';

angular.module('mscApp')
.factory('Auth', function ($http, Session, SERVER_URL, ServiceAjax) {
	var authService = {};

	authService.login = function (credentials) {
		return ServiceAjax.users().login(credentials)
		.then(function (res) {
			// Session.create(res.data.id, res.data.user.id, res.data.user.role);

			Session.create(res.data._id, res.data._id, res.data.role, res.data.firstName);
	    	return res.data;
		}, function(data) {
			console.log('Error: ' + data);
		});
	};

	authService.logout = function () {
		Session.destroy();
	};

	authService.isAuthenticated = function () {
		return !!Session.userId();
	};

	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.role()) !== -1);
	};

	return authService;
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
});
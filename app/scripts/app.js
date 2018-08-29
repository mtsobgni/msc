'use strict';

/**
 * @ngdoc overview
 * @name mscApp
 * @description
 * # mscApp
 *
 * Main module of the application.
 */
angular
  .module('mscApp', [
    'ngRoute', 'ui.bootstrap'
  ])

  .constant ('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authentifié',
    notAuthorized: 'auth-not-authorized'
  })
  .constant ('USER_ROLES', {
    all: '*',
    admin: '0',
    owner: '1',
    planner: '2'
  })
  .constant('SERVER_URL', 'http://mscbd.myseatingchart.xyz/')
  .constant ('FLOW_STEPS', {
    login: '0',
    myspace: '1',
    main: '2'
  })

  .config(function ($routeProvider, $httpProvider, $locationProvider, USER_ROLES) {
    $routeProvider
      .when('/howItWork', {
        templateUrl: 'views/howitwork.html',
        controller: 'howitworkCtrl',
        controllerAs: 'howItWork',
        css: 'styles/howitwork.css'
      })
      .when('/aboutUs', {
        templateUrl: 'views/aboutus.html',
        controller: 'aboutusCtrl',
        controllerAs: 'aboutUs'
      })
      .when('/contactUs', {
        templateUrl: 'views/contactus.html',
        controller: 'contactusCtrl',
        controllerAs: 'contactUs'
      })
      .when('/ourServices', {
        templateUrl: 'views/ourservices.html',
        controller: 'ourservicesCtrl',
        controllerAs: 'OurServices'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
      })
      .when('/subscribe', {
        templateUrl: 'views/subscribe.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
      })
      .when('/myspace', {
        templateUrl: 'views/myspace.html',
        controller: 'MyspaceCtrl',
        controllerAs: 'myspace',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.owner, USER_ROLES.planner]
        }
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.planner]
        }
      })
      .when('/profil', {
        templateUrl: 'views/profil.html',
        controller: 'ProfilCtrl',
        controllerAs: 'profil',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.owner, USER_ROLES.planner]
        }
      })
      .otherwise({
        redirectTo: '/howItWork'
      });

    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
    // $locationProvider.html5Mode(true);
  })
  .run(function ($rootScope, AUTH_EVENTS, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if(next.data === undefined) {
        return;
      }
      var authorizedRoles = next.data.authorizedRoles;
      if (!Auth.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (Auth.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          alert('Désolé, vous n avez pas les droits pour cette action.');
        } else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          alert('SVP, veuillez vous authentifier.');
          $location.path('/login');
        }
      }
    });
  })

  .controller('ApplicationController', function ($scope, USER_ROLES, Auth, FLOW_STEPS, $location, Session) {
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = Auth.isAuthorized;
    $scope.flowSteps = FLOW_STEPS;
    $scope.step = null;
   
    $scope.setCurrentUser = function () {
      $scope.currentUser = {
        '_id': Session.userId(),
        'role': Session.role(),
        'firstName': Session.firstName()
      };
    };

    $scope.setStep = function (step) {
      $scope.step = step;
    };

    $scope.logout = function () {
      Auth.logout();
      $scope.currentUser = null;
      $scope.step = FLOW_STEPS.login;
      $location.path("/");
    };
  });

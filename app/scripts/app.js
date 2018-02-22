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
  .constant('serverURL', 'http://myseatingchart.xyz:3000/')
  .constant('serverURLMail', 'http://myseatingchart.xyz:3000/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
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
      .when('/howItWork', {
        templateUrl: 'views/howitwork.html',
        controller: 'howitworkCtrl',
        controllerAs: 'howItWork',
        css: 'styles/howitwork.css'
      })
      .when('/myspace', {
        templateUrl: 'views/myspace.html',
        controller: 'MyspaceCtrl',
        controllerAs: 'myspace'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/profil', {
        templateUrl: 'views/profil.html',
        controller: 'ProfilCtrl',
        controllerAs: 'profil'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

angular.module('mscApp')
  .factory('ServiceAjax', function ($http, SERVER_URL) {
    // Service logic
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var url = SERVER_URL;
    // Public API here
    return {
        users: function () {
            return {
                login: function (user) {
                    url = SERVER_URL + 'api/user/login';
                    return $http.post(SERVER_URL + 'api/user/login', user, headers);
                },
                create: function (user) {
                    url = SERVER_URL + 'api/user';
                    return $http.post(url, user, headers);
                },
                update: function (user) {
                    url = SERVER_URL + 'api/user/'+ (user.id || '');
                    return $http.put(url, user, headers);
                },
                get: function (id) {
                    url = SERVER_URL + 'api/user/' + (id || '');
                    return $http.get(url);
                },
                getCurrentUser: function () {
                    /*req.method = 'GET';
                    req.url = SERVER_URL + 'api/user/me' ;
                    return $http(req);*/
                }
            };
        },
        events: function () {
            return {
                get: function (id) {
                    url = SERVER_URL + 'event/' + (id || '');
                    return $http.get(url, headers);
                },
                getBy: function (id) {
                    url = SERVER_URL + 'event/by/' + (id || '');
                    return $http.get(url, headers);
                },
                getByOnwer: function (id) {
                    url = SERVER_URL + 'event/owner/' + (id || '');
                    return $http.get(url, headers);
                },
                getByRoom: function (id) {
                    url = SERVER_URL + 'event/room/' + (id || '');
                    return $http.get(url, headers);
                },
                set: function (event) {
                    url = SERVER_URL + 'event';
                    return $http.put(url, event, headers);
                },
                all: function () {
                    url = SERVER_URL + 'event';
                    return $http.get(url, headers);
                },
                create: function (event) {
                    url = SERVER_URL + 'event';
                    return $http.post(url, event, headers);
                }
            };
        },
        rooms: function () {
            return {
                get: function (id) {
                    url = SERVER_URL + 'api/room/' + (id || '');
                    return $http.get(url, headers);
                },
                all: function () {
                    return this.get();
                }
            };
        },
        guests: function () {
            return {
                get: function (id) {
                    url = SERVER_URL + 'api/guest/' + (id || '');
                    return $http.get(url, headers);
                },
                all: function (evtId) {
                    return this.get(!evtId ? null : '?evtId='+evtId);
                },
                create: function (guest) {
                    url = SERVER_URL + 'api/guest';
                    return $http.post(url, guest, headers);
                },
                delete: function (id) {
                    url = SERVER_URL + 'api/guest/' + (id || '');
                    return $http.delete(url, headers);
                }
            };
        },
        contacts: function () {
            return {
                sendMail: function (data) {
                    url = SERVER_URL + 'api/contact/contact-form';
                    return $http.post(url, data, headers);
                }
            };
        }
    };
  });

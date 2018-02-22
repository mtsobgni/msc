'use strict';



/**
 * @ngdoc service
 * @name mscApp.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the mscApp.
 */
angular.module('mscApp')
  .factory('serviceAjax', function ($http, serverURL, serverURLMail) {
    // Service logic
    var headers = {"Content-Type": "application/x-www-form-urlencoded"};
    var url = serverURLMail;

    var reqMail = {
        url: serverURLMail//,
        // headers: {
        // 'Content-Type': 'application/json'
        // }
    };

    // Public API here
    return {
        users: function () {
            return {
                login: function (user) {
                    url = serverURL + 'api/user/login';
                    return $http.post(url, user, headers);
                },
                create: function (user) {
                    url = serverURL + 'api/user';
                    return $http.post(url, user, headers);
                },
                update: function (user) {
                    url = serverURL + 'api/user/'+ (user.id || '');
                    return $http.put(url, user, headers);
                },
                get: function (id) {
                    url = serverURL + 'api/user/' + (id || '');
                    return $http.get(url);
                },
                getCurrentUser: function () {
                    req.method = 'GET';
                    req.url = serverURL + 'api/user/me' ;
                    return $http(req);
                }
            };
        },
        events: function () {
            return {
                get: function (id) {
                    url = serverURL + 'api/event/' + (id || '');
                    return $http.get(url, headers);
                },
                set: function (event) {
                    url = serverURL + 'api/event/' + event.id;
                    return $http.put(url, event, headers);
                },
                all: function () {
                    url = serverURL + 'api/event';
                    return $http.get(url, headers);
                },
                create: function (event) {
                    url = serverURL + 'api/event';
                    return $http.post(url, event, headers);
                }
            };
        },
        rooms: function () {
            return {
                get: function (id) {
                    url = serverURL + 'api/room/' + (id || '');
                    return $http.get(url, headers);
                },
                all: function () {
                    return this.get();
                }
            };
        },
        mail: function () {
            return {
                send: function (data) {
                    reqMail.method = 'POST';
                    reqMail.url = serverURLMail + 'sendMail' ;
                    reqMail.body = data;
                    return $http(reqMail);
                    
                }
            };
        },
        guests: function () {
            return {
                get: function (id) {
                    url = serverURL + 'api/guest/' + (id || '');
                    return $http.get(url, headers);
                },
                all: function (evtId) {
                    return this.get(!evtId ? null : "?evtId="+evtId);
                },
                create: function (guest) {
                    url = serverURL + 'api/guest';
                    return $http.post(url, guest, headers);
                }
            };
        }
    };
  });

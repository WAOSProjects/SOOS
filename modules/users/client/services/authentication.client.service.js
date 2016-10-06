(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window', '$state', '$http', '$location', '$q', 'UsersService'];

  function Authentication($window, $state, $http, $location, $q, UsersService) {
    var readyPromise = $q.defer();

    var auth = {
      user: null,
      token: null,
      login: login,
      signout: signout,
      refresh: refresh,
      readyPromise: $q.defer()
    };

    // Initialize service
    init();

    return auth;

    function init() {
      var token = localStorage.getItem('token') || $location.search().token || null;
      // Remove the token from the URL if present
      $location.search('token', null);

      if (token) {
        auth.token = token;
        $http.defaults.headers.common.Authorization = 'JWT ' + token;
        refresh();
      } else {
        auth.readyPromise.resolve(auth);
      }
    }

    function login(user, token) {
      auth.user = user;
      auth.token = token;

      localStorage.setItem('token', token);
      $http.defaults.headers.common.Authorization = 'JWT ' + token;

      auth.readyPromise.resolve(auth);
    }

    function signout() {
      localStorage.removeItem('token');
      auth.user = null;
      auth.token = null;

      $state.go('home', { reload: true });
    }

    function refresh(requestFromServer, callback) {
      readyPromise = $q.defer();

      UsersService.me(auth.user).$promise
      .then(function (user) {
        auth.user = user;
        auth.readyPromise.resolve(auth);
      })
      .catch(function (errorResponse) {
        auth.readyPromise.reject(errorResponse);
      });
    }
  }
}());

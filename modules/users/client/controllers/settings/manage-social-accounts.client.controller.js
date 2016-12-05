(function () {
  'use strict';

  angular
    .module('users')
    .controller('SocialAccountsController', SocialAccountsController);

  SocialAccountsController.$inject = ['$state', '$window', '$http', 'Authentication'];

  function SocialAccountsController($state, $window, $http, Authentication) {
    var vm = this;

    vm.user = Authentication.user;
    vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.removeUserSocialAccount = removeUserSocialAccount;
    vm.callOauthProvider = callOauthProvider;

    // Check if there are additional accounts
    function hasConnectedAdditionalSocialAccounts() {
      return (vm.user.additionalProvidersData && Object.keys(vm.user.additionalProvidersData).length);
    }

    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {
      vm.success = vm.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        vm.success = true;
        vm.user = Authentication.user = response;
      }).error(function (response) {
        vm.error = response.message;
      });
    }

    // OAuth provider request
    function callOauthProvider(url) {
      url += '?redirect_to=' + encodeURIComponent($state.$current.url.prefix);

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }
}());

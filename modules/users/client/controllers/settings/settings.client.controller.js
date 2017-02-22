(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'Authentication', '$state'];

  function SettingsController($scope, Authentication, $state) {
    var vm = this;
    vm.currentNavItem = '';

    vm.user = Authentication.user;

    /* Selected tab management */
    function setActiveTab() {
      switch ($state.current.name) {
        case 'settings.profile':
          toggleTabs('profile');
          break;
        case 'settings.picture':
          toggleTabs('picture');
          break;
        case 'settings.password':
          toggleTabs('password');
          break;
        case 'settings.accounts':
          toggleTabs('accounts');
          break;
        default:
          toggleTabs('profile');
      }
    }

    function toggleTabs(tab) {
      vm.currentNavItem = tab;
    }

    /* VIEW INIT */
    setActiveTab();
  }
}());

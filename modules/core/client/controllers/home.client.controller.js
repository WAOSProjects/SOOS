(function() {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope'];

  function HomeController($scope) {
    var vm = this;
    vm.logo = true;
    vm.showSomething = function() {
      vm.logo = !vm.logo;
      $scope.$apply();
    };
  }
}());

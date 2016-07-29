(function() {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Authentication'];

  function HomeController($scope, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    vm.logo=true;
    vm.showSomething = function(){
      vm.logo=!vm.logo;
      $scope.$apply();
    };
  }
}());

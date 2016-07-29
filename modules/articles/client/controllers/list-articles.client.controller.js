(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', 'Authentication'];

  function ArticlesListController(ArticlesService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;

    vm.articles = ArticlesService.query();
  }
}());

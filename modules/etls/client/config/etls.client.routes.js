(function() {
  'use strict';

  angular
    .module('etls.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'appInformation'];

  function routeConfig($stateProvider, appInformation) {
    $stateProvider
      .state('etl', {
        url: appInformation.view + '/etl',
        template: '<ui-view/>',
        data: {
          pageTitle: 'Etl'
        },
        redirectTo: 'etl.view'
      })
      .state('etl.view', {
        url: '',
        templateUrl: '/modules/etls/client/views/view-etl.client.view.html',
        controller: 'EtlsController',
        controllerAs: 'vm',
        data: {
          pageSubTitle: 'View'
        }
      });
  }
}());

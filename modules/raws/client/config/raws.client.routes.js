(function() {
  'use strict';

  angular
    .module('raws.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'appInformation'];

  function routeConfig($stateProvider, appInformation) {
    $stateProvider
      .state('soos', {
        url: appInformation.view + '/raws',
        template: '<ui-view/>',
        data: {
          pageTitle: 'Soos'
        },
        redirectTo: 'soos.view'
      })
      .state('soos.view', {
        url: '',
        templateUrl: 'modules/raws/client/views/view-raw.client.view.html',
        controller: 'RawsController',
        controllerAs: 'vm',
        data: {
          pageSubTitle: 'View'
        }
      });
  }
}());

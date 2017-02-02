// Etls service used to communicate Etls REST endpoints
(function () {
  'use strict';

  angular
    .module('etls')
    .factory('EtlsService', EtlsService);

  EtlsService.$inject = ['$resource'];

  function EtlsService($resource) {
    return $resource('api/etls/:etlId', {
      etlId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

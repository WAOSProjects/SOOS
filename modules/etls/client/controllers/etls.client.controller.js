(function () {
  'use strict';

  // Etls controller
  angular
    .module('etls')
    .controller('EtlsController', EtlsController);

  EtlsController.$inject = ['$scope', '$state', 'Authentication', 'Upload'];

  function EtlsController($scope, $state, Authentication, Upload, etl) {
    var vm = this;

    vm.authentication = Authentication;
    vm.etl = etl;
    vm.error = null;
    vm.data = {};
    vm.metadata = {};
    vm.tableSettings = {
      manualColumnMove: true,
      manualColumnResize: true,
      contextMenu: false,
      afterChange: 'afterChange',
      dropdownMenu: true
      // performance tip: set constant size
      /*      colWidths: 80,
            rowHeights: 23,
            // performance tip: turn off calculations
            autoRowSize: false,
            autoColSize: false,*/
    };

    alasql("CREATE TABLE example1 (a INT, b INT)");

    alasql.tables.example1.data = [ // Insert data directly from javascript object...
      {
        a: 2,
        b: 6
      },
      {
        a: 3,
        b: 4
      }
    ];

    alasql("INSERT INTO example1 VALUES (1,5)"); // ...or you insert data with normal SQL

    var res = alasql("SELECT * FROM example1 ORDER BY b DESC");

    console.log(res); // [{a:2,b:6},{a:1,b:5},{a:3,b:4}]

  }
}());

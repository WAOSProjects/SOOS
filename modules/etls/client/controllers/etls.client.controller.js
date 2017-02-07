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
    vm.title = title;
    vm.file = {};
    vm.tableSettings = {
      manualColumnMove: true,
      manualColumnResize: true,
      contextMenu: false,
      afterChange: 'afterChange',
      dropdownMenu: true,
      // performance tip: set constant size
      /*       colWidths: 80,
                  rowHeights: 23,
                  // performance tip: turn off calculations
      /*            autoRowSize: false,
                  autoColSize: false*/
    };



    // Tablea header html

    function title(column) {
      var html;
      html = '<div layout="column" layout-align="center center"><p class="md-body-2">' + column + '</p><div>' + 'type' + '</div></div>';
      return html;
    }



    listtable()

    function listtable() {
      alasql('ATTACH INDEXEDDB DATABASE data; \
        USE' + 'data' + ';', function () {
        // List Table from IndexedDB
        alasql.promise('SHOW TABLES FROM data')
          .then(function (res) {
            vm.listTable = res;
          }).catch(function (err) {
            console.log('Error:', err);
          });
      });
    }



    /*    function listtable() {
          alasql('ATTACH INDEXEDDB DATABASE data; \
            USE data;', function () {
            // List Table from IndexedDB
            alasql.promise('SHOW TABLES FROM data')
              .then(function (res) {
                vm.listTable = res;
              }).catch(function (err) {
                console.log('Error:', err);
              });
          });
        }
    */

    loadtable();

    function loadtable() {
      alasql('ATTACH INDEXEDDB DATABASE data; \
        USE data; \
        ', function () {
        // Select data from IndexedDB
        alasql.promise('SELECT * FROM etl LIMIT 100')
          .then(function (res) {
            vm.metadata = Object.keys(res[0]);
            vm.data = res;
          }).catch(function (err) {
            console.log('Error:', err);
          });
      });
    }

    vm.upload = function (file) {
      alasql('CREATE INDEXEDDB DATABASE IF NOT EXISTS data;\
        ATTACH INDEXEDDB DATABASE data; \
        USE data; \
        DROP TABLE IF EXISTS etl; \
        CREATE TABLE etl; \
        SELECT * INTO etl FROM FILE(?, {headers:true})', [file.originalEvent], function () {
        // Select data from IndexedDB
        alasql.promise('SELECT * FROM etl LIMIT 100')
          .then(function (res) {
            vm.metadata = Object.keys(res[0]);
            vm.data = res;
            console.log('data', vm.data);
            console.log('metadata', vm.metadata);
          }).catch(function (err) {
            console.log('Error:', err);
          });
      });
    };


    /*    testcalc()

        function testcalc() {
          alasql('ATTACH INDEXEDDB DATABASE data; \
            USE data; \
            ', function () {
            // Select data from IndexedDB
            alasql.promise('SELECT Order_Priority , SUM([Shipping Cost]) AS payout FROM etl GROUP BY Order_Priority ')
              .then(function (res) {
                console.log('result', res)
              }).catch(function (err) {
                console.log('Error:', err);
              });
          });
        }*/


  }
}());

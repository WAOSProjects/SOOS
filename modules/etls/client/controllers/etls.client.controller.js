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
    vm.data = {}
    vm.metadata = {}
    vm.listTable = {};
    vm.tableSettings = {
      /*      afterRender: function () {
              console.log('afterRender call');
            },*/
      manualColumnMove: true,
      manualColumnResize: true,
      contextMenu: false,
      dropdownMenu: true
      // performance tip: set constant size
      /*       colWidths: 80,
                  rowHeights: 23,
                  // performance tip: turn off calculations
      /*            autoRowSize: false,
                  autoColSize: false*/
    };

    // Project info



    vm.dashboardName = 'dashboard_1';

    // Init IndexedDB database for dashboardName


    alasql('CREATE INDEXEDDB DATABASE IF NOT EXISTS ' + vm.dashboardName + '; ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + ' ; USE ' + vm.dashboardName + ';', function () {
      // List Table from dashboardName
      alasql.promise('SHOW TABLES FROM ' + vm.dashboardName)
        .then(function (res) {
          vm.listTable = res;
          console.log(vm.listTable);
        }).catch(function (err) {
          console.log('Error:', err);
        });
    });




    vm.deleteTable = function (table) {
      alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
        USE ' + vm.dashboardName + '; \
        ', function () {
        // delete table
        alasql.promise('DROP TABLE ' + table)
          .then(function (res) {
            var index = vm.listTable.indexOf(table);
            vm.listTable.splice(index, 1);
            console.log(vm.listTable);
          }).catch(function (err) {
            console.log('Error:', err);
          });
      });
    };


    vm.loadTable = function (tableid) {
      vm.metadata[tableid] = {};
      vm.data[tableid] = {};
      console.log(tableid);
      alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
        USE ' + vm.dashboardName + '; \
        ', function () {
        // Select data from tableid
        alasql.promise('SELECT * FROM ' + tableid + ' LIMIT 50')
          .then(function (res) {
            vm.metadata[tableid] = Object.keys(res[0]);
            vm.data[tableid] = res;

            console.log('finished loading', vm.data[tableid]);
          }).catch(function (err) {
            console.log('Error:', err);
          });
      });
    };





    vm.upload = function (event, file) {
      console.log(file);
      var tableName = file.name.replace(/\.[^/.]+$/, '');
      console.log(tableName);
      alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
        USE ' + vm.dashboardName + '; \
        DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + '; \
        SELECT * INTO ' + tableName + ' FROM FILE(?, {headers:true})', [event.originalEvent], function () {
        // Select data from IndexedDB
        vm.listTable.push({
          tableid: tableName
        });
        console.log(vm.listTable)
        /*vm.loadTable(tableName);*/
        /*        alasql.promise('SELECT * FROM ' + tableName + ' LIMIT 100')
                  .then(function (res) {
                    vm.metadata = Object.keys(res[0]);
                    vm.data = res;

                  }).catch(function (err) {
                    console.log('Error:', err);
                  });*/
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

    // Tablea header html

    function title(column) {
      var html;
      html = '<div layout="column" layout-align="center center"><p class="md-body-2">' + column + '</p><div>' + 'type' + '</div></div>';
      return html;
    }

  }
}());

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
    vm.data = [];
    vm.metadata = [];

    vm.tableSettings = {
      /*      afterRender: function () {
              console.log('afterRender call');
            },*/
      stretchH: 'all',
      manualColumnMove: true,
      manualColumnResize: true,
      contextMenu: false,
      dropdownMenu: true,
      correctFormatBoolean: true,
      autoWrapRow: true
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

    vm.changeType = function(){

    };


    vm.loadTable = function (tableid) {
      if (!vm.metadata[tableid]) {
        alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
        USE ' + vm.dashboardName + '; \
        ', function () {
            // Select data from tableid
            alasql.promise('SELECT * FROM ' + tableid + ' LIMIT 50')
              .then(function (res) {
                var i;
                var metadata = [],
                  item;
                var label = Object.keys(res[0]);
                console.log(label)
                for (i in label) {
                  item = {};
                  item.label = label[i];
                  /* take first line to infer type // todo: make it 10 */
                  item.type = typeof (res[0][label[i]]);
                  console.log('dede', res[0][label[i]])
                  metadata.push(item);
                }
                vm.metadata[tableid] = metadata;
                vm.data[tableid] = res;
              }).catch(function (err) {
                console.log('Error:', err);
              });
         
        });
         }
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
        vm.listTable.concat({
          tableid: tableName
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

    // Tablea header html

    function title(column) {
      var html;
      html = '<div layout="column" layout-align="center center"><p class="header label">' + column.label + '</p><div class="header type">' + column.type + '</div></div>';
      return html;
    }

  }
}());

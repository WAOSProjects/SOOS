(function () {
  'use strict';

  // Etls controller
  angular
    .module('etls')
    .controller('EtlsController', EtlsController);

  EtlsController.$inject = ['$scope', '$state', 'Authentication', 'Upload', 'alasql'];

  function EtlsController($scope, $state, Authentication, Upload, alasql) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.title = title;
    vm.file = {};
    vm.data = [];
    vm.metadata = [];
    vm.listTable = [];
    vm.count = 0;
    vm.loading = [];
    vm.message = '';
    vm.tableSettings = {
      stretchH: 'all',
      manualColumnMove: true,
      manualColumnResize: true,
      autoWrapRow: true
    };

    vm.groups = [{
      name: 'GroupBy',
      items: []
    }];








    $scope.$watch('vm.groups', function (model) {
      vm.modelAsJson = angular.toJson(model, true);
    }, true);

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

    vm.changeType = function () {

    };


    vm.loadTable = function (tableid) {
      if (!vm.metadata[tableid]) {
        vm.loading[tableid] = true;
        alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
        USE ' + vm.dashboardName + '; \
        ', function () {
          // Select data from tableid and get count record
          alasql.promise(['SELECT * FROM ' + tableid + ' LIMIT 50',
              'SELECT COUNT(*) FROM ' + tableid
            ])
            .then(function (res) {
              console.log('res',res)
              var data = res[0];
              var i;
              var metadata = [],
                item;
              // get first 50 records

              // select de result of the first query
              var label = Object.keys(data[0]);

              for (i in label) {
                if (label) {
                  item = {};
                  item.label = label[i];
                  /* take first line to infer type // todo: make it 10 */
                  item.type = typeof (data[0][label[i]]);
                  metadata.push(item);
                }
                vm.metadata[tableid] = metadata;
                vm.data[tableid] = data;
                vm.loading[tableid] = false;
              }

              // get basic info
              for (i in vm.listTable) {
                if (vm.listTable[i].tableid === tableid) {
                  vm.listTable[i].colsCount = label.length;
                  vm.listTable[i].rowsCount = res[1][0]['COUNT(*)'];
                  break;
                }
              }
              $scope.$apply();
              console.log('done loading')
            }).catch(function (err) {
              console.log('Error:', err);
            });
        });
      }
    };


    vm.buildQuery = function (tableid) {
      alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
            USE ' + vm.dashboardName + '; \
            ', function () {
        // Sconfigelect variables
        var variables = [];
        var i;
        for (i in vm.groups[0].items) {
          if (vm.groups[0].items[i].type === 'number') {
            variables.push('SUM(' + vm.groups[0].items[i].label + ')');
          } else {
            variables.push(vm.groups[0].items[i].label);
          }
        }

        variables = variables.join(', ');

        // GroupBy TODO : reduce not filter
        var groupBy = vm.groups[0].items.filter(function (elem) {
          if (elem.type === 'number') {
            console.log('thats a number');
            return false;
          }
          return true;
        }).map(function (elem) {
          return elem.label;
        });

        switch (groupBy.length) {
          case 0:
            groupBy = null;
            break;
          case 1:
            groupBy = ' GROUP BY ' + groupBy;
            break;
          default:
            groupBy = ' GROUP BY ' + groupBy.join(', ');
        }

        // Select data from IndexedDB
        alasql.promise('SELECT ' + variables + ' FROM ' + tableid + groupBy)
          .then(function (res) {
            vm.item = res;
          }).catch(function (err) {
            console.log('Error:', err);
          });

      });
    };




    vm.chartConfig = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Test Highchart'
      },
      xAxis: {
        categories: '',
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },

      credits: {
        enabled: false
      },
      series: [{
        name: 'Year 2012',
        data: [1052, 954, 4250, 740, 38]
      }]
    };






    vm.upload = function (event, file) {
      var tableName = file.name.replace(/\.[^/.]+$/, '');
      var rawdata;
      var i;
      vm.message = 'Inserting into database';
      alasql.promise('SELECT * FROM FILE(?, {headers:true})', [event.originalEvent]).then(function (res) {

        // Web worker version
        alasql.worker();
        var data = res;
        console.log('inserting', data);
        alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; USE ' + vm.dashboardName + '; DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';SELECT * INTO ' + tableName + ' FROM ?', [data], function (data) {
          console.log('success', data.length);

        });

        vm.message = 'Done Inserting';
        /*       alasql('INSERT INTO ? VALUES ?', [tableName,[data[i]]], function (res) {
                 console.log(res);
               });*/

        /* }*/


      });





    };


    /*     alasql('SELECT * FROM FILE(?, {headers:true})', [event.originalEvent], function (data) {
           rawdata = data;
           console.log(rawdata);
           alasql.worker();


           for (i in rawdata) {
             alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
                 USE ' + vm.dashboardName + '; \
                 SELECT * INTO ' + tableName + ' FROM ?', [rawdata[i]], function () {
               // Select data from IndexedDB
               console.log('yes');
             });
           }
         });*/


    /*      alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
            USE ' + vm.dashboardName + '; \
            DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + '; \
            SELECT * INTO ' + tableName + ' FROM FILE(?, {headers:true})', [event.originalEvent], function () {
            // Select data from IndexedDB
            vm.listTable.concat({
              tableid: tableName
            });
          });*/
    /*   };*/


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

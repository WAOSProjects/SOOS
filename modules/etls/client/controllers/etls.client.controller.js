(function () {
  'use strict';

  // Etls controller
  angular
    .module('etls')
    .controller('EtlsController', EtlsController);

  EtlsController.$inject = ['$scope', '$state', 'Authentication', 'Upload', 'alasql', '$mdToast'];

  function EtlsController($scope, $state, Authentication, Upload, alasql, $mdToast) {
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
    vm.types = ['number', 'text', 'date'];


    vm.tableSettings = {
      stretchH: 'all',
      manualColumnMove: true,
      manualColumnResize: true,
      autoWrapRow: true
      /* ,
           colHeaders: true,
           columns: columns,
           afterGetColHeader: function (col, TH) {
             var instance = this,
               menu = buildMenu(columns[col].type),
               button = buildButton();

             addButtonMenuEvent(button, menu);

             Handsontable.Dom.addEvent(menu, 'click', function (event) {
               if (event.target.nodeName == 'LI') {
                 setColumnType(col, event.target.data['colType'], instance);
               }
             });
             if (TH.firstChild.lastChild.nodeName === 'BUTTON') {
               TH.firstChild.removeChild(TH.firstChild.lastChild);
             }
             TH.firstChild.appendChild(button);
             TH.style['white-space'] = 'normal';
           }*/
    };


    /*

        function addButtonMenuEvent(button, menu) {
          Handsontable.Dom.addEvent(button, 'click', function (event) {
            var changeTypeMenu, position, removeMenu;

            document.body.appendChild(menu);

            event.preventDefault();
            event.stopImmediatePropagation();

            changeTypeMenu = document.querySelectorAll('.changeTypeMenu');

            for (var i = 0, len = changeTypeMenu.length; i < len; i++) {
              changeTypeMenu[i].style.display = 'none';
            }
            menu.style.display = 'block';
            position = button.getBoundingClientRect();

            menu.style.top = (position.top + (window.scrollY || window.pageYOffset)) + 2 + 'px';
            menu.style.left = (position.left) + 'px';

            removeMenu = function (event) {
              if (event.target.nodeName == 'LI' && event.target.parentNode.className.indexOf('changeTypeMenu') !== -1) {
                if (menu.parentNode) {
                  menu.parentNode.removeChild(menu);
                }
              }
            };
            Handsontable.Dom.removeEvent(document, 'click', removeMenu);
            Handsontable.Dom.addEvent(document, 'click', removeMenu);
          });
        }

        function buildMenu(activeCellType) {
          var
            menu = document.createElement('UL'),
            types = ['text', 'numeric', 'date'],
            item;

          menu.className = 'changeTypeMenu';

          for (var i = 0, len = types.length; i < len; i++) {
            item = document.createElement('LI');
            if ('innerText' in item) {
              item.innerText = types[i];
            } else {
              item.textContent = types[i];
            }

            item.data = {
              'colType': types[i]
            };

            if (activeCellType == types[i]) {
              item.className = 'active';
            }
            menu.appendChild(item);
          }

          return menu;
        }

        function buildButton() {
          var button = document.createElement('BUTTON');

          button.innerHTML = '\u25BC';
          button.className = 'changeType';

          return button;
        }

        function setColumnType(i, type, instance) {
          columns[i].type = type;
          instance.updateSettings({
            columns: columns
          });
          instance.validateCells(function () {
            instance.render();
          });
        }


    */




    vm.groups = [{
      name: 'GroupBy',
      items: []
    }];

    vm.dashboard = [];




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
          console.log('vm.listTable', vm.listTable);
        }).catch(function (err) {
          console.log('Error:', err);
        });
    });


    //


    vm.fetchMetadata = function (tableid) {
      if (!vm.metadata[tableid]) {
        alasql.promise(['SELECT * FROM ' + tableid + ' LIMIT 25'])
          .then(function (res) {
            var data = res[0];
            var i;
            var metadata = [],
              item;
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
                break;
              }
            }
            console.log('done loading metadata', vm.metadata[tableid]);
          }).catch(function (err) {
            console.log('Error:', err);
          });

      }
    };





    vm.deleteTable = function (table) {
      alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; \
        USE ' + vm.dashboardName + '; \
        ', function () {
        // delete table
        alasql.promise('DROP TABLE ' + table)
          .then(function (res) {
            var index = vm.listTable.indexOf(table);
            vm.listTable.splice(index, 1);
            console.log('vm.listTable from vm.deleteTable', vm.listTable);
          }).catch(function (err) {
            console.log('Error:', err);
          });
      });
    };

    vm.changeType = function () {

    };


    vm.loadTable = function (tableid) {
      if (!vm.metadata[tableid] || vm.metadata[tableid].length > 1) {
        vm.loading[tableid] = true;
        alasql.promise(['SELECT * FROM ' + tableid + ' LIMIT 50',
            'SELECT COUNT(*) FROM ' + tableid
          ])
          .then(function (res) {
            console.log('res from vm.loadTable', res)
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
            console.log('done loading');
          }).catch(function (err) {
            console.log('Error:', err);
          });

      }
    };


    vm.buildQuery = function (tableid) {
      console.log(tableid)
      // Select variables
      var variables = [];
      var i;
      for (i in vm.groups[0].items) {
        if (vm.groups[0].items[i].type === 'number') {
          variables.push('SUM([' + vm.groups[0].items[i].label + '])');
        } else {
          variables.push('[' + vm.groups[0].items[i].label + ']');
        }
      }

      variables = variables.join(', ');

      // GroupBy TODO : reduce not filter
      var groupBy = vm.groups[0].items.filter(function (elem) {
        if (elem.type === 'number') {
          return false;
        }
        return true;
      }).map(function (elem) {
        return elem.label;
      });

      switch (groupBy.length) {
        case 0:
          groupBy = '';
          break;
        case 1:
          groupBy = ' GROUP BY [' + groupBy + ']';
          break;
        default:
          var groupByProperFormat = [];
          console.log('groupBy', groupBy)
          for (i in groupBy) {
            groupByProperFormat.push('[' + groupBy[i] + ']');
          }
          groupBy = ' GROUP BY ' + groupByProperFormat.join(', ');
      }

      console.log('request from buildQuery', 'SELECT ' + variables + ' FROM ' + tableid + groupBy);

      // Select data from IndexedDB
      alasql.promise('SELECT ' + variables + ' FROM ' + tableid + groupBy)
        .then(function (res) {
          vm.item = res;
          $scope.$apply();
        }).catch(function (err) {
          console.log('Error:', err);
        });

    };





    /*

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
              }afterGetColHeader
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
                groupBy = '';
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
                 $scope.$apply();
              }).catch(function (err) {
                console.log('Error:', err);
              });

          });*/
    /*  };
     */



    vm.chartConfig = [{
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
        }],
        thumbnail: ''
      },
      {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Test Highchart2'
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
        }],
        thumbnail: ''
      }
    ];






    vm.upload = function (event, file) {
      var tableName = file.name.replace(/\.[^/.]+$/, '');

      var i;
      $mdToast.show(
        $mdToast.simple()
        .position('top right')
        .textContent('Loading Table!')
        .hideDelay('false')
      );

      alasql.promise('DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';SELECT * FROM FILE(?, {headers:true})', [event.originalEvent]).then(function (res) {
        alasql.worker();

        console.log('res from upload', res)
        var data = _.chunk(res[2], 1000);
        console.log('chunck', data)
        vm.count = 0;
        for (i in data) {
          if (data[i]) {

            alasql('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; USE ' + vm.dashboardName + '; INSERT INTO ' + tableName + ' SELECT * FROM ?', [data[i]], function (dat) {
              console.log('imported')
              vm.count = vm.count + 1;
            });


          }
        }
      }).catch(function (err) {
        console.log('error:', err);
      });



    };




    /*      alasql.promise('SELECT * FROM FILE(?, {headers:true})', [event.originalEvent]).then(function (res) {

            // Web worker version

            var data = _.chunk(res, 1000);
            console.log('data', data);
            for (i in data) {
              if (data[i]) {
                console.log('DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';INSERT INTO ' + tableName + ' SELECT * FROM ?', data[i]);
                alasql.promise('DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';INSERT INTO ' + tableName + ' SELECT * FROM ?', data[i]);
              }
            }
            return console.log('all good fool')
            /* return alasql.promise('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; USE ' + vm.dashboardName + '; DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';INSERT INTO ' + tableName + ' SELECT * FROM ?', [data]);*/
    /*}).catch(function (err) {
      console.log('error:', err);
    });*/





    /*
       vm.upload = function (event, file) {
          var tableName = file.name.replace(/\.[^/.]+$/, '');
          var rawdata;
          var i;
          $mdToast.show(
            $mdToast.simple()
            .position('top right')
            .textContent('Loading Table!')
            .hideDelay('false')
          );
          alasql.promise('SELECT * FROM FILE(?, {headers:true})', [event.originalEvent]).then(function (res) {

            // Web worker version
            alasql.worker();
            var data = _.chunk(res, 1000);
            console.log('data', data);
            for (i in data) {
              if (data[i]) {
                console.log('DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';INSERT INTO ' + tableName + ' SELECT * FROM ?', data[i]);
                alasql.promise('DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';INSERT INTO ' + tableName + ' SELECT * FROM ?', data[i]);
              }
            }
            return console.log('all good fool')
             /* return alasql.promise('ATTACH INDEXEDDB DATABASE ' + vm.dashboardName + '; USE ' + vm.dashboardName + '; DROP TABLE IF EXISTS ' + tableName + '; CREATE TABLE ' + tableName + ';INSERT INTO ' + tableName + ' SELECT * FROM ?', [data]);*/
    /*  }).catch(function (err) {
        console.log('error:', err);
      });
    };*/


    // Convert a graph to an SVG for thumbnail
    vm.saveAsBinary = function (chartId) {
      var svg = document.getElementById(chartId).children[0].innerHTML;
      return svg = "data:image/svg+xml," + svg;
    };



    // TODO To be deleted
    vm.genChart = function () {
      vm.gen = true;
    };
    vm.testThumbnailGen = function (chartId) {
      var thumbnail = vm.saveAsBinary(chartId);

      $('#binaryImage').attr('src', thumbnail);
    };



    vm.delChartFromDash = function (index) {
      vm.dashboard.splice(index, 1);
    };




    /*    var originatorEv;

        vm.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
    */

    // Tablea header html
    function title(column) {
      var html;

      html = '<div layout="column" layout-align="center center"><p class="header label">' + column.label + '</p><div class="header type">' + column.type + '</div></div>';
      return html;
    }

  }
}());

(function() {
  'use strict';

  // raw controller
  angular
    .module('raws')
    .controller('RawsController', RawsController);


  RawsController.$inject = ['$scope', '$state', 'Authentication', 'RawsService', '_'];

  function RawsController($scope, $state, Authentication, RawsService, _, hotRegisterer, $mdDialog, $mdMedia) {
    var vm = this;

    vm.authentication = Authentication;

    vm.samples = [{
      title: 'Cars (multivariate)',
      url: '../assets/data/multivariate.csv'
    }, {
      title: 'Movies (dispersions)',
      url: '../assets/data/dispersions.csv'
    }, {
      title: 'Music (flows)',
      url: '../assets/data/flows.csv'
    }, {
      title: 'Cocktails (correlations)',
      url: '../assets/data/correlations.csv'
    }]


    vm.showHelp = function(ev) {

      console.log('modal')
      $mdDialog.show({
        templateUrl: './modules/raws/client/templates/help.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })

    };

    vm.selectSample = function(sample) {
      if (!sample) return;
      RawsService.loadSample(sample.url).then(
        function(data) {
          vm.text = data;
        },
        function(error) {
          vm.error = error;
        }
      );
    }

    // init
    vm.raw = raw;
    vm.data = [];
    vm.metadata = [];
    vm.error = false;
    vm.loading = true;

    vm.categories = ['Correlations', 'Distributions', 'Time Series', 'Hierarchies', 'Others'];

    vm.parse = function(text) {

      if (vm.model) vm.model.clear();

      vm.data = [];
      vm.metadata = [];
      vm.error = false;
      $scope.$apply();



      try {
        var parser = raw.parser();
        vm.data = parser(vm.text);
        vm.metadata = parser.metadata(vm.text);
        vm.error = false;
      } catch (e) {
        vm.data = [];
        vm.metadata = [];
        vm.error = e.name == 'ParseError' ? +e.message : false;
      }
      if (!vm.data.length && vm.model) vm.model.clear();
      vm.loading = false;
    }

    /* Table custom renderer */

    vm.tableSettings = {
      contextMenu: true,
      stretchH: 'all'
    };



    /*CodeMirror*/
    vm.codeMirrorOptions = {
      lineNumbers: true,
      lineWrapping: true,
      placeholder: 'Paste your text or drop a file here. No data on hand? Try one of our sample datasets!'
    }


    vm.delayParse = RawsService.debounce(vm.parse, 500, false);

    $scope.$watch('vm.text', function(text) {
      vm.loading = true;
      vm.delayParse(vm.text);
    });

    vm.charts = raw.charts.values().sort(function(a, b) {
      return a.title() < b.title() ? -1 : a.title() > b.title() ? 1 : 0;
    });
    vm.chart = vm.charts[0];
    vm.model = vm.chart ? vm.chart.model() : null;

    $scope.$watch('vm.error', function(error) {
      if (!$('.CodeMirror')[0]) return;
      var cm = $('.CodeMirror')[0].CodeMirror;
      if (!error) {
        cm.removeLineClass(vm.lastError, 'wrap', 'line-error');
        return;
      }
      cm.addLineClass(error, 'wrap', 'line-error');
      cm.scrollIntoView(error);
      vm.lastError = error;


    })







    vm.selectChart = function(chart) {
      if (chart == vm.chart) return;
      vm.model.clear();
      vm.chart = chart;
      vm.model = vm.chart.model();
    }



  }
})();

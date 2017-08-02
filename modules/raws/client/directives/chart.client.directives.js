(function() {
  'use strict';

  angular
            .module('raws')
            .constant('d3', window.d3)
            .directive('chart', chart);

  chart.$inject = ['d3', '$rootScope', 'RawsService'];

  function chart(d3, $rootScope, RawsService) {
    return {
      restrict: 'A',
      scope: {
        chart: '=',
        data: '=',
        model: '=',
        svgcode: '='
      },
      link: function postLink(scope, element, attrs) {

        function update() {

          d3.select(element[0]).select('*').remove();
          if (!scope.chart || !scope.data.length) {
            d3.select(element[0]).append('span').text('Please, review your data');
            return true;
          }

          if (!scope.chart || !scope.data.length) return;
          if (!scope.model.isValid()) return;


          d3.select(element[0])
                            .append('svg')
                            .datum(scope.data)
                            .call(scope.chart);

          scope.svgcode = d3.select(element[0])
                            .select('svg')
                            .attr('xmlns', 'http://www.w3.org/2000/svg')
                            .node().parentNode.innerHTML;

        }

        scope.delayUpdate = RawsService.debounce(update, 300, false);

        scope.$watch('chart', update);
        scope.$on('update', update);
        // scope.$watch('data', update)
        scope.$watch(function() {
          if (scope.model) return scope.model(scope.data);
        }, update, true);
        scope.$watch(function() {
          if (scope.chart) return scope.chart.options().map(function(d) {
            return d.value;
          });
        }, scope.delayUpdate, true);
      }
    };
  }

}());

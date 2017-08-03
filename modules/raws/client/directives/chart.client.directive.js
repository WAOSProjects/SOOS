/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('chart', chart);

  chart.$inject = ['$rootScope', 'dataService'];

  function chart($rootScope, dataService) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        function update() {
          $('*[data-toggle="tooltip"]').tooltip({
            container: 'body'
          });

          d3.select(element[0]).select("*").remove();

          if (!scope.chart || !scope.data.length) return;
          if (!scope.model.isValid()) return;

          d3.select(element[0])
            .append("svg")
            .datum(scope.data)
            .call(
              scope.chart
              .on('startDrawing', function() {
                if (!scope.$$phase) {
                  scope.chart.isDrawing(true)
                  scope.$apply()
                }
              })
              .on('endDrawing', function() {
                $rootScope.$broadcast("completeGraph");
                if (!scope.$$phase) {
                  scope.chart.isDrawing(false)
                  scope.$apply()
                }
              })
            )

          scope.svgCode = d3.select(element[0])
            .select('svg')
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

          $rootScope.$broadcast("completeGraph");

        }

        scope.delayUpdate = dataService.debounce(update, 300, false);

        scope.$watch('chart', function() {
          console.log("> chart");
          update();
        });
        scope.$on('update', function() {
          console.log("> update");
          update();
        });
        //scope.$watch('data', update)
        scope.$watch(function() {
          if (scope.model) return scope.model(scope.data);
        }, update, true);
        scope.$watch(function() {
          if (scope.chart) return scope.chart.options().map(function(d) {
            return d.value
          });
        }, scope.delayUpdate, true);

      }
    };
  }
}());

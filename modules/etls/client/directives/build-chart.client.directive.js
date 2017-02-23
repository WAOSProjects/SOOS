(function() {
  'use strict';

  angular.module('etls')
    .directive('buildChart', buildChart);

  function buildChart($rootScope, $timeout, $interpolate, $state) {

    return {
      restrict: 'E',
      scope: {
        chartId: '@chartId',
        chartConfig: '=chartConfig'
      },
      template: '<highchart id="{{chartId}}" config="chartConfig"></highchart>',

      link: function(scope, element, attrs) {
        scope.$watch('chartConfig', function(newValue, oldValue) {
          if (newValue)
            var thumbnail = saveAsBinary(element.children().children()[0].innerHTML);
          $('#binaryImage').attr('src', thumbnail);
        }, true);

        function saveAsBinary(elem){
          //var svg = document.getElementById(chartId).children[0].innerHTML;
          //return svg = "data:image/svg+xml,"+svg;

          var svg;

          return svg = "data:image/svg+xml,"+elem;
        };
      }

    };
  }
}());

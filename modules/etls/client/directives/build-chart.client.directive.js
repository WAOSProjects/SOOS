(function() {
  'use strict';

  angular.module('etls')
    .directive('buildChart', buildChart);

  function buildChart($rootScope, $timeout, $interpolate, $state) {

    return {
      restrict: 'E',
      scope: {
        chartId: '=chartId',
        chartConfig: '=chartConfig'
      },
      template: '<highchart id="{{chartId}}" config="chartConfig"></highchart>',

      link: function(scope, element, attrs) {
        scope.$watch('chartConfig', function(newValue, oldValue) {
          if (newValue) {
            var svgHTML = element.children().children()[0].innerHTML;
            // TODO SVG version ?
            var svgThumbnail = saveAsBinary(svgHTML);
            scope.chartConfig.thumbnail = svgThumbnail;

            // TODO PNG version ?
            var pngThumbnail = svgHTML;
            var svg = element.children().children().children()[0];
            var width = svg.getAttribute('width');
            var height = svg.getAttribute('height');
            var imgSrc = 'data:image/svg+xml;base64,' + btoa(pngThumbnail);
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext('2d');
            var image = new Image;
            image.src = imgSrc;

            image.onload = function() {
              context.drawImage(image, 0, 0);
              var canvasdata = canvas.toDataURL('image/png');
              // scope.chartConfig.thumbnail = canvasdata;
            };
          }
        }, true);

        function saveAsBinary(elem) {
          var svg = 'data:image/svg+xml,' + elem;
          // TODO To Base64 encode for future record ?
          // var svg = 'data:image/svg+xml;base64,' + btoa(elem);

          return svg;
        }
      }

    };
  }
}());

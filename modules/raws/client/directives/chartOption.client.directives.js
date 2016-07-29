(function() {
  'use strict';

  angular
        .module('raws')
        .directive('chartOption', chartOption);

  chartOption.$inject = [];

  function chartOption() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var firstTime = false;

        element.find('.option-fit').click(function() {
          scope.$apply(fitWidth);
        });

        scope.$watch('chart', fitWidth);

        function fitWidth(chart, old) {
          if (chart == old) return;
          if (!scope.option.fitToWidth || !scope.option.fitToWidth()) return;
          scope.option.value = $('.flex-80').width();
        }

        $(document).ready(fitWidth);

      }
    };
  }
}());
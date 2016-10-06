(function() {
  'use strict';

  angular
        .module('raws')
        .directive('draggable', draggable);

  draggable.$inject = ['$window'];

  function draggable($window) {

    return {
      restrict: 'A',
      scope: false,
            //  templateUrl : 'templates/dimensions.html',
      link: function postLink(scope, element, attrs) {

        scope.$watch('vm.metadata', function(metadata) {
          if (!metadata.length) element.find('li').remove();
          element.find('li').draggable({
            connectToSortable: '.dimensions-container',
            helper: 'clone',
            revert: 'invalid',
            start: onStart
          });
        });

        function onStart(e, ui) {
          /* todo : find element.width properly */
          ui.helper.width(element.width() + 5);
          ui.helper.css('z-index', '100000');
        }

      }
    };
  }
}());

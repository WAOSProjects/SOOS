/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('draggable', draggable);

  draggable.$inject = [];

  function draggable() {
    return {
      restrict: 'A',
      scope: false,
      //  templateUrl : 'templates/dimensions.html',
      link: function postLink(scope, element, attrs) {

        scope.$watch('metadata', function(metadata) {
          if (!metadata.length) element.find('li').remove();
          element.find('li').draggable({
            connectToSortable: '.dimensions-container',
            helper: 'clone',
            revert: 'invalid',
            start: onStart
          })
        })

        function onStart(e, ui) {
          ui.helper.addClass("dropped");
          ui.helper.css('z-index', '100000');
        }

      }
    }
  }
}());

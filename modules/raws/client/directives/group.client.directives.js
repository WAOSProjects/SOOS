(function() {
  'use strict';

  angular
        .module('raws')
        .directive('group', group);

  group.$inject = [];

  function group() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch(attrs.watch, function(watch) {
          var last = element;
          element.children().each(function(i, o) {
            if ((i) && (i) % attrs.every === 0) {
              var oldLast = last;
              last = element.clone().empty();
              last.insertAfter(oldLast);
            }
            $(o).appendTo(last);
          });
        }, true);
      }
    };
  }
}());

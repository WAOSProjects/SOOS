(function() {
  'use strict';

  angular
        .module('raws')
        .directive('sortable', sortable);

  sortable.$inject = ['$rootScope'];

  function sortable($rootScope) {
    return {
      restrict: 'A',
      scope: {
        title: '=',
        value: '=',
        types: '=',
        multiple: '='
      },
      template: '<div class="msg">{{messageText}}</div>',
      link: function postLink(scope, element, attrs) {

        var removeLast = false;

        element.sortable({
          items: '> li',
          connectWith: '.dimensions-container',
          placeholder: 'drop',
          start: onStart,
          update: onUpdate,
          receive: onReceive,
          remove: onRemove,
          over: over,
          tolerance: 'intersect'
        });

        function over(e, ui) {
          var dimension = ui.item.data().dimension,
            html = isValidType(dimension) ? '<i class="fa fa-arrow-circle-down breath-right"></i>Drop here' : '<i class="fa fa-times-circle breath-right"></i>Don\'t drop here';
          element.find('.drop').html(html);
        }

        function onStart(e, ui) {
          var dimension = ui.item.data().dimension,
            html = isValidType(dimension) ? '<i class="fa fa-arrow-circle-down breath-right"></i>Drop here' : '<i class="fa fa-times-circle breath-right"></i>Don\'t drop here';
          element.find('.drop').html(html);
          element.parent().css('overflow', 'visible');
          angular.element(element).scope().open = false;
        }

        function onUpdate(e, ui) {

          ui.item.find('.dimension-icon').remove();

          if (ui.item.find('span.remove').length === 0) {
            ui.item.append('<span class=\'remove pull-right\'>&times;</span>');
          }
          ui.item.find('span.remove').click(function() {
            ui.item.remove();
            onRemove();
          });

          if (removeLast) {
            ui.item.remove();
            removeLast = false;
          }

          scope.value = values();
          scope.$apply();

          element.parent().css('overflow', 'hidden');

          var dimension = ui.item.data().dimension;
          ui.item.toggleClass('invalid', !isValidType(dimension));
          message();

          $rootScope.$broadcast('update');
        }

        scope.$watch('value', function(value) {
          if (!value.length) {
            element.find('li').remove();
          }
          message();
        });

        function onReceive(e, ui) {
          var dimension = ui.item.data().dimension;

          removeLast = hasValue(dimension);

          if (!scope.multiple && scope.value.length) {
            var found = false;
            element.find('li').each(function(i, d) {
              if ($(d).data().dimension.key === scope.value[0].key && !found) {
                $(d).remove();
                found = true;
                removeLast = false;
              }
            });
          }
          scope.value = values();
          ui.item.find('span.remove').click(function() {
            ui.item.remove();
            onRemove();
          });
        }

        function onRemove(e, ui) {
          scope.value = values();
          scope.$apply();
        }

        function values() {
          if (!element.find('li').length) return [];
          var v = [];
          element.find('li').map(function(i, d) {
            v.push($(d).data().dimension);
            return true;
          });
          return v;
        }

        function hasValue(dimension) {

          for (var i = 0; i < scope.value.length; i++) {
            if (scope.value[i].key === dimension.key) {
              return true;
            }
          }
          return false;
        }

        function isValidType(dimension) {
          if (!dimension) return;
          return scope.types.map(function(d) {
            return d.name;
          }).indexOf(dimension.type) !== -1;

        }

        function message() {
          var hasInvalidType = values().filter(function(d) {
            return !isValidType(d);
          }).length > 0;
          scope.messageText = hasInvalidType ? 'You should only use ' + scope.types.map(function(d) {
            return d.name.toLowerCase() + 's';
          }).join(' or ') + ' here' : 'Drag ' + scope.types.map(function(d) {
            return d.name.toLowerCase() + 's';
          }).join(', ') + ' here';
          // element.parent().find('.msg').html(messageText);
        }

      }
    };
  }
}());

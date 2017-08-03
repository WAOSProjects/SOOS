/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('colors', colors);

  colors.$inject = ['$rootScope'];

  function colors($rootScope) {
    return {
      restrict: 'A',
      templateUrl: '/modules/raws/client/templates/colors.html',
      link: function postLink(scope, element, attrs) {

        scope.scales = [

          {
            type: 'Ordinal (categories)',
            value: d3.scale.ordinal().range(raw.divergingRange(1)),
            reset: function(domain) {
              this.value.range(raw.divergingRange(domain.length || 1));
            },
            update: ordinalUpdate
          },
          /*{
            type : 'Ordinal (max 20 categories)',
            value : d3.scale.category20(),
            reset : function(){ this.value.range(d3.scale.category20().range().map(function (d){ return d; })); },
            update : ordinalUpdate
          },
          {
            type : 'Ordinal B (max 20 categories)',
            value : d3.scale.category20b(),
            reset : function(){ this.value.range(d3.scale.category20b().range().map(function (d){ return d; })); },
            update : ordinalUpdate
          },
          {
            type : 'Ordinal C (max 20 categories)',
            value : d3.scale.category20c(),
            reset : function(){ this.value.range(d3.scale.category20c().range().map(function (d){ return d; })); },
            update : ordinalUpdate
          },
          {
            type : 'Ordinal (max 10 categories)',
            value : d3.scale.category10(),
            reset : function(){ this.value.range(d3.scale.category10().range().map(function (d){ return d; })); },
            update : ordinalUpdate
          },*/
          {
            type: 'Linear (numeric)',
            value: d3.scale.linear().range(["#f7fbff", "#08306b"]),
            reset: function() {
              this.value.range(["#f7fbff", "#08306b"]);
            },
            update: linearUpdate
          }
        ];

        function ordinalUpdate(domain) {
          if (!domain.length) domain = [null];
          this.value.domain(domain);
          listColors();
        }

        function linearUpdate(domain) {
          domain = d3.extent(domain, function(d) {
            return +d;
          });
          if (domain[0] == domain[1]) domain = [null];
          this.value.domain(domain).interpolate(d3.interpolateLab);
          listColors();
        }

        scope.setScale = function() {
          scope.option.value = scope.colorScale.value;
          scope.colorScale.reset(scope.colorScale.value.domain());
          $rootScope.$broadcast("update");
        }

        function addListener() {
          scope.colorScale.reset(scope.colorScale.value.domain());
          scope.option.on('change', function(domain) {
            scope.option.value = scope.colorScale.value;
            scope.colorScale.update(domain);
          })
        }

        scope.colorScale = scope.scales[0];

        scope.$watch('chart', addListener)
        scope.$watch('colorScale.value.domain()', function(domain) {
          scope.colorScale.reset(domain);
          listColors();
        }, true);

        function listColors() {
          scope.colors = scope.colorScale.value.domain().map(function(d) {
            return {
              key: d,
              value: scope.colorScale.value(d).charAt(0) == '#' ? scope.colorScale.value(d) : '#' + scope.colorScale.value(d)
            }
          }).sort(function(a, b) {
            if (raw.isNumber(a.key) && raw.isNumber(b.key)) return a.key - b.key;
            return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
          })
        }

        scope.setColor = function(key, color) {
          var domain = scope.colorScale.value.domain(),
            index = domain.indexOf(key),
            range = scope.colorScale.value.range();
          range[index] = color;
          scope.option.value.range(range);
          $rootScope.$broadcast("update");
        }

        scope.foreground = function(color) {
          return d3.hsl(color).l > .5 ? "#000000" : "#ffffff";
        }

        scope.$watch('option.value', function(value) {
          if (!value) scope.setScale();
        })

      }
    };
  }
}());

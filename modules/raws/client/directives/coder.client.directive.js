/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('coder', coder);

  coder.$inject = [];

  function coder() {
    return {
      restrict: 'EA',
      template: '<md-input-container class="md-block">'+
      '<textarea id="source" readonly class="source-area" rows="5" md-select-on-focus ng-model="svgCode"></textarea>'+
      '</md-input-container>',
      link: function postLink(scope, element, attrs) {

        scope.$on('completeGraph', function() {

          var svgCode = d3.select('#chart > svg')
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

          element.find('textarea').val(svgCode)
        })

        /*function asHTML(){
          if (!$('#chart > svg').length) return "";
          return d3.select('#chart > svg')
          	.attr("xmlns", "http://www.w3.org/2000/svg")
          	.node().parentNode.innerHTML;
        }
        scope.$watch(asHTML, function(){
          scope.html = asHTML();
        },true)
        scope.$on('update', function(){
        	scope.html = asHTML();
        })*/
      }
    };
  }
}());

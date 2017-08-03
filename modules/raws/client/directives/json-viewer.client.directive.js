/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('jsonViewer', jsonViewer);

  jsonViewer.$inject = ['dataService'];

  function jsonViewer(dataService) {
    return {
      scope: {
        json: "=",
        onSelect: "="
      },

      link: function postLink(scope, element, attrs) {

        scope.$watch('json', function(json) {
          update();
        })

        function update() {

          d3.select(element[0]).selectAll("*").remove();

          var tree = d3.select(element[0])
            .append("div")
            .classed("json-node", "true")

          var j = scope.json;

          explore(j, tree);

          function explore(m, el) {


            if (el === tree && is.object(m) && is.not.array(m) && is.not.empty(m)) {

              el.append("div")
                //	.classed("json-node","true")
                .text(function(d) {
                  return "{";
                })

            }


            var n = el === tree && is.array(m) && is.not.empty(m) ? [m] : m;

            for (var c in n) {

              var cel = el.append("div")
                .datum(n[c]) //function(d){console.log(el === tree, n); return el === tree ? {tree:n} : n[c]})
                .classed("json-node", "true")

              if (is.array(n[c]) && is.not.empty(n[c])) {

                cel.classed("json-closed", function(d) {
                  return el === tree ? "false" : "true"
                })

                cel.classed("json-array", function(d) {
                  return el === tree ? "false" : "true"
                })

                //data-toggle="tooltip"
                //data-title="Clear all"

                cel.append("i")
                  .classed("json-icon fa fa-plus-square-o pull-left", "true")
                  .on("click", function(d) {
                    d3.event.stopPropagation();
                    d3.select(this.parentNode).classed("json-closed", function() {
                      return !d3.select(this).classed("json-closed");
                    })
                    d3.select(this).classed("fa-plus-square-o", d3.select(this.parentNode).classed("json-closed"))
                    d3.select(this).classed("fa-minus-square-o", !d3.select(this.parentNode).classed("json-closed"))
                  })
              }

              cel.append("div")
                .html(function(d) {
                  var pre = is.array(n) ? "" : "<b>" + c + "</b> : ";
                  var text = is.array(n[c]) ? "[" : is.object(n[c]) ? "{" : n[c];
                  text += is.array(n[c]) && !n[c].length ? "]" : is.object(n[c]) && is.empty(n[c]) ? "}" : "";
                  return pre + text;
                })

              if (is.object(n[c])) explore(n[c], cel);
            }

            if (is.array(n) && el !== tree) {

              el.select('div')
                .attr("data-toggle", "tooltip")
                .attr("data-title", function(d) {
                  return "Load " + d.length + " records";
                })
                .on("mouseover", function(d) {
                  d3.event.stopPropagation();
                  d3.select(this.parentNode).classed("json-hover", true)
                })
                .on("mouseout", function(d) {
                  d3.event.stopPropagation();
                  d3.select(this.parentNode).classed("json-hover", false)
                })
                .on("click", function(d) {
                  d3.event.stopPropagation();
                  scope.onSelect(d);
                })
            }

            if (is.object(n) && is.not.empty(n)) {

              if (is.array(n) && el === tree) return;

              el.append("div")
                //	.classed("json-node","true")
                .text(function(d) {
                  var text = is.array(n) ? "]" : "}";
                  return text;
                })
            }

            $('[data-toggle="tooltip"]').tooltip({
              animation: false
            });

          }


        }


      }
    };
  }
}());

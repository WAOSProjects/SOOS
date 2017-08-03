/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('rawTable', rawTable);

  rawTable.$inject = [];

  function rawTable() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var sortBy,
          descending = true;

        function update() {

          d3.select(element[0]).selectAll("*").remove();

          if (!scope.data || !scope.data.length) {
            d3.select(element[0]).append("span").text("Please, review your data")
            return;
          }

          var table = d3.select(element[0])
            .append('table')
            .attr("class", "table table-striped table-condensed")

          if (!sortBy) sortBy = scope.metadata[0].key;

          var headers = table.append("thead")
            .append("tr")
            .selectAll("th")
            .data(scope.metadata)
            .enter().append("th")
            .text(function(d) {
              return d.key;
            })
            .on('click', function(d) {
              descending = sortBy == d.key ? !descending : descending;
              sortBy = d.key;
              update();
            })

          headers.append("i")
            .attr("class", function(d) {
              return descending ? "fa fa-sort-desc pull-right" : "fa fa-sort-asc pull-right"
            })
            .style("opacity", function(d) {
              return d.key == sortBy ? 1 : 0;
            })

          var rows = table.append("tbody")
            .selectAll("tr")
            .data(scope.data.sort(sort))
            .enter().append("tr");

          var cells = rows.selectAll("td")
            .data(d3.values)
            .enter().append("td");
          cells.text(String);

        }

        function sort(a, b) {
          if (raw.isNumber(a[sortBy]) && raw.isNumber(b[sortBy])) return descending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
          return descending ? a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0 : a[sortBy] < b[sortBy] ? 1 : a[sortBy] > b[sortBy] ? -1 : 0;
        }

        scope.$watch('data', update);
        scope.$watch('metadata', function() {
          sortBy = null;
          update();
        });

      }
    };
  }
}());

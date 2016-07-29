(function() {
  'use strict';

  angular
    .module('raws')
    .filter('categoryFilter', categoryFilter);

  categoryFilter.$inject = [];

  function categoryFilter() {
    return function(charts, category) {
      return charts.filter(function(chart) {
        return !chart.category() && category == 'Others' || chart.category() == category;
      });
    };
  }
})();
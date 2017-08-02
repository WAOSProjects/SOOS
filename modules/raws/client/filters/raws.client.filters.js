/* eslint-disable */

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

  angular
    .module('raws')
    .filter('decodeUrl', decodeUrl);

  decodeUrl.$inject = [];

  function decodeUrl() {
    return function(url) {
      if (!url) return url;
      return decodeURIComponent(url);
    };
  }
}());

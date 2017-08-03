/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('copyButton', copyButton);

  copyButton.$inject = [];

  function copyButton() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var client = new ZeroClipboard(element);

        client.on("ready", function(readyEvent) {
          client.on('aftercopy', function(event) {
            element.trigger("mouseout");
            setTimeout(function() {
              element.tooltip({
                title: 'Copied'
              });
              element.tooltip('show');
            }, 150);
          });
        });

        element.on('mouseover', function(client, args) {
          element.tooltip('destroy');
          element.tooltip({
            title: 'Copy to clipboard'
          });
          element.tooltip('show');
        });

        element.on('mouseout', function(client, args) {
          element.tooltip('destroy');
        });
      }
    };
  }
}());

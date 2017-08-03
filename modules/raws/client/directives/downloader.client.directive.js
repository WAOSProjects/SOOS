/* eslint-disable */

(function() {
  'use strict';

  angular.module('raws')
    .directive('downloader', downloader);

  downloader.$inject = [];

  function downloader() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="row">' +
        '<form class="form-search col-lg-12">' +
        '<button bs-select class="btn btn-default" placeholder="Choose type" ng-model="mode" bs-options="m.label for m in modes">' +
        'Select <span class="caret"></span>' +
        '</button>' +
        '<input class="form-control col-lg-12" placeholder="Filename" type="text" ng-model="filename">' +
        '<button class="btn btn-success form-control" ng-class="{disabled:!mode.label}" ng-click="mode.download()">Download</button>' +
        '</form>' +
        '</div>',

      link: function postLink(scope, element, attrs) {

        var source = "#chart > svg";

        var getBlob = function() {
          return window.Blob || window.WebKitBlob || window.MozBlob;
        }

        // Removing HTML entities from svg
        function decodeHtml(html) {
          /*var txt = document.createElement("textarea");
          txt.innerHTML = html;
          return txt.value;*/
          return html.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#' + i.charCodeAt(0) + ';';
          });
        }

        function downloadSvg() {
          var BB = getBlob();

          var html = d3.select(source)
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

          //html = he.encode(html);

          var isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);

          if (isSafari) {
            var img = "data:image/svg+xml;utf8," + html;
            var newWindow = window.open(img, 'download');
          } else {
            var blob = new BB([html], {
              type: "data:image/svg+xml"
            });
            saveAs(blob, (element.find('input').val() || element.find('input').attr("placeholder")) + ".svg")
          }

        }

        function downloadPng() {

          var content = d3.select("body").append("canvas")
            .attr("id", "canvas")
            .style("display", "none")

          var html = d3.select(source)
            .node().parentNode.innerHTML;

          var image = new Image;
          image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(html)));

          var canvas = document.getElementById("canvas");

          var context = canvas.getContext("2d");

          image.onload = function() {

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);

            var isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);

            if (isSafari) {
              var img = canvas.toDataURL("image/png;base64");
              var newWindow = window.open(img, 'download');
              window.location = img;
            } else {
              var a = document.createElement("a");
              a.download = (scope.filename || element.find('input').attr("placeholder")) + ".png";
              a.href = canvas.toDataURL("image/png;base64");
              var event = document.createEvent("MouseEvents");
              event.initMouseEvent(
                "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
              );
              a.dispatchEvent(event);
            }
          };
          d3.select("#canvas").remove();

        }

        var downloadData = function() {
          var json = JSON.stringify(scope.model(scope.data));
          var blob = new Blob([json], {
            type: "data:text/json;charset=utf-8"
          });
          saveAs(blob, (scope.filename || element.find('input').attr("placeholder")) + ".json")
        }

        scope.modes = [{
            label: 'Vector graphics (svg)',
            download: downloadSvg
          },
          {
            label: 'Image (png)',
            download: downloadPng
          },
          {
            label: 'Data model (json)',
            download: downloadData
          }
        ]
        //scope.mode = scope.modes[0]

      }
    };
  }
}());

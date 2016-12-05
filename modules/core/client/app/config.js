(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: [
      'ngResource',
      'ngAnimate',
      'ngMessages',
      'ngSanitize',
      'ngMaterial',
      'ui.router',
      'ngFileUpload',
      'ngImgCrop',
      '720kb.tooltips',
      'angular-loading-bar',
      'angularUtils.directives.dirPagination',
      'ui.codemirror',
      'ngHandsontable',
      'color.picker',
      'angular-loading-bar',
      'ngclipboard',
      'ngSurprise'
    ],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }
}(window));

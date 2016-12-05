(function(app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies)
    .constant('_', window._);


  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig)
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.loadingBarTemplate = '<div id="loading-bar"><div class="loading-bar bar"><div class="peg"></div></div></div>';
    }])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.definePalette('roMEANetPalette', {
        '50': 'a3b3c3',
        '100': '8a9cae',
        '200': '75899d',
        '300': '5f768c',
        '400': '4b6278',
        '500': '34495e',
        '600': '2c3e50',
        '700': 'd32f2f',
        '800': '213447',
        '900': '192e42',
        'A100': '9c9c9c',
        'A200': '6f6f6f',
        'A400': '364554',
        'A700': '273e56',
        'contrastDefaultColor': 'light', // whether, by default, text (contrast) on this palette should be dark or light
        'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'], // hues which contrast should be 'dark' by default
        'contrastLightColors': undefined // could also specify this if default was 'dark'
      });
      $mdThemingProvider.theme('default')
        .primaryPalette('roMEANetPalette')
        .accentPalette('roMEANetPalette');
    });

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');

    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
  }

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider'];

  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);
  }
}(ApplicationConfiguration));

'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/materialize/dist/css/materialize.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/ng-img-crop/compile/unminified/ng-img-crop.css',
        'public/lib/angular-tooltips/dist/angular-tooltips.css',
        'public/lib/angular-loading-bar/build/loading-bar.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/codemirror/lib/codemirror.css',
        'public/lib/handsontable/dist/handsontable.full.css',
        'public/lib/angular-color-picker/dist/angularjs-color-picker.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/ng-img-crop/compile/unminified/ng-img-crop.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/materialize/dist/js/materialize.min.js',
        'public/lib/angular-materialize/src/angular-materialize.js',
        'public/lib/lodash/dist/lodash.js',
        'public/lib/angular-tooltips/dist/angular-tooltips.js',
        'public/lib/angular-loading-bar/build/loading-bar.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/d3/d3.js',
        'public/lib/d3-plugins/**/!(*-test).js',
        'public/lib/angular-ui-codemirror/ui-codemirror.js',
        'public/lib/codemirror/lib/codemirror.js',
        'public/lib/codemirror/addon/display/placeholder.js',
        'public/lib/FileSaver/FileSaver.js',
        'public/lib/jquery-ui/jquery-ui.js',
        'public/lib/jqueryui-touch-punch/jquery.ui.touch-punch.js',
        'public/lib/clipboard/dist/clipboard.min.js',
        'public/lib/ngclipboard/dist/ngclipboard.js',
        'public/lib/handsontable/dist/handsontable.full.js',
        'public/lib/ngHandsontable/dist/ngHandsontable.js',
        'public/lib/angular-color-picker/dist/angularjs-color-picker.js',
        'public/lib/tinycolor/dist/tinycolor-min.js',
        'public/lib/canvas-toBlob.js/canvas-toBlob.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};

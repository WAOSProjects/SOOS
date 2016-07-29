'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/materialize/dist/css/materialize.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/angular-tooltips/dist/angular-tooltips.css',
        'public/lib/nvd3/build/nv.d3.css',
        'public/lib/angular-loading-bar/build/loading-bar.css',
        'public/lib/codemirror/lib/codemirror.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/handsontable/dist/handsontable.full.css',
        'public/lib/angular-color-picker/dist/angularjs-color-picker.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-loading-bar/build/loading-bar.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/materialize/dist/js/materialize.min.js',
        'public/lib/angular-materialize/src/angular-materialize.js',
        'public/lib/lodash/dist/lodash.js',
        'public/lib/d3/d3.js',
        'public/lib/nvd3/build/nv.d3.js',
        'public/lib/angular-nvd3/dist/angular-nvd3.js',
        'public/lib/angular-mass-autocomplete/massautocomplete.js',
        'public/lib/angular-tooltips/dist/angular-tooltips.js',
        'public/lib/moment/moment.js',
        'public/lib/moment/locale/en-gb.js',
        'public/lib/angular-moment/angular-moment.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-ui-codemirror/ui-codemirror.js',
        'public/lib/codemirror/lib/codemirror.js',
        'public/lib/codemirror/addon/display/placeholder.js',
        'public/lib/FileSaver/FileSaver.js',
        'public/lib/jquery-ui/jquery-ui.js',
        'public/lib/jqueryui-touch-punch/jquery.ui.touch-punch.js',
        'public/lib/d3-plugins/**/*.js',
        'public/lib/clipboard/dist/clipboard.min.js',
        'public/lib/ngclipboard/dist/ngclipboard.js',
        'public/lib/handsontable/dist/handsontable.full.js',
        'public/lib/ngHandsontable/dist/ngHandsontable.js',
        'public/lib/angular-color-picker/dist/angularjs-color-picker.js',
        'public/lib/tinycolor/dist/tinycolor-min.js',
        'public/lib/canvas-toBlob.js/canvas-toBlob.js'
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
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    configAuth: 'config/**/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};

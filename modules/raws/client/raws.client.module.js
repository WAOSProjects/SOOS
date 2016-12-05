(function (app) {
  'use strict';
  app.registerModule('raws', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('raws.services');
  app.registerModule('raws.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

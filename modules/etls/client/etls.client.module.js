(function (app) {
  'use strict';
  app.registerModule('etls', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('etls.services');
  app.registerModule('etls.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

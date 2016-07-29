'use strict';

/**
 * Module dependencies
 */
var rawsPolicy = require('../policies/raws.server.policy'),
  raws = require('../controllers/raws.server.controller');

module.exports = function(app) {
  // Raws Routes
  app.route('/api/raws').all(rawsPolicy.isAllowed)
    .get(raws.list)
    .post(raws.create);

  app.route('/api/raws/:rawId').all(rawsPolicy.isAllowed)
    .get(raws.read)
    .put(raws.update)
    .delete(raws.delete);

  // Finish by binding the Raw middleware
  app.param('rawId', raws.rawByID);
};

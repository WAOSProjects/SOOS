'use strict';

/**
 * Module dependencies
 */
var etlsPolicy = require('../policies/etls.server.policy'),
  etls = require('../controllers/etls.server.controller');

module.exports = function(app) {
  // Etls Routes
  app.route('/api/etls').all(etlsPolicy.isAllowed)
    .get(etls.list)
    .post(etls.create);

  app.route('/api/etls/:etlId').all(etlsPolicy.isAllowed)
    .get(etls.read)
    .put(etls.update)
    .delete(etls.delete);

  // Finish by binding the Etl middleware
  app.param('etlId', etls.etlByID);
};

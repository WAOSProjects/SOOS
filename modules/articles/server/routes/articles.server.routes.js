'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  express = require('express'),
  articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function (app) {
  var router = express.Router();
  // Articles collection routes
  router.route('/').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  router.route('/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  // Finish by binding the article middleware
  router.param('articleId', articles.articleByID);

  app.use('/api/articles', router);
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Etl = mongoose.model('Etl'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Etl
 */
exports.create = function(req, res) {
  var etl = new Etl(req.body);
  etl.user = req.user;

  etl.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(etl);
    }
  });
};

/**
 * Show the current Etl
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var etl = req.etl ? req.etl.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  etl.isCurrentUserOwner = req.user && etl.user && etl.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(etl);
};

/**
 * Update a Etl
 */
exports.update = function(req, res) {
  var etl = req.etl ;

  etl = _.extend(etl , req.body);

  etl.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(etl);
    }
  });
};

/**
 * Delete an Etl
 */
exports.delete = function(req, res) {
  var etl = req.etl ;

  etl.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(etl);
    }
  });
};

/**
 * List of Etls
 */
exports.list = function(req, res) { 
  Etl.find().sort('-created').populate('user', 'displayName').exec(function(err, etls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(etls);
    }
  });
};

/**
 * Etl middleware
 */
exports.etlByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Etl is invalid'
    });
  }

  Etl.findById(id).populate('user', 'displayName').exec(function (err, etl) {
    if (err) {
      return next(err);
    } else if (!etl) {
      return res.status(404).send({
        message: 'No Etl with that identifier has been found'
      });
    }
    req.etl = etl;
    next();
  });
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Raw = mongoose.model('Raw'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Raw
 */
exports.create = function(req, res) {
  var raw = new Raw(req.body);
  raw.user = req.user;

  raw.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raw);
    }
  });
};

/**
 * Show the current Raw
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var raw = req.raw ? req.raw.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  raw.isCurrentUserOwner = req.user && raw.user && raw.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(raw);
};

/**
 * Update a Raw
 */
exports.update = function(req, res) {
  var raw = req.raw ;

  raw = _.extend(raw , req.body);

  raw.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raw);
    }
  });
};

/**
 * Delete an Raw
 */
exports.delete = function(req, res) {
  var raw = req.raw ;

  raw.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raw);
    }
  });
};

/**
 * List of Raws
 */
exports.list = function(req, res) { 
  Raw.find().sort('-created').populate('user', 'displayName').exec(function(err, raws) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(raws);
    }
  });
};

/**
 * Raw middleware
 */
exports.rawByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Raw is invalid'
    });
  }

  Raw.findById(id).populate('user', 'displayName').exec(function (err, raw) {
    if (err) {
      return next(err);
    } else if (!raw) {
      return res.status(404).send({
        message: 'No Raw with that identifier has been found'
      });
    }
    req.raw = raw;
    next();
  });
};

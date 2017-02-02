'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Etl Schema
 */
var EtlSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Etl name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Etl', EtlSchema);

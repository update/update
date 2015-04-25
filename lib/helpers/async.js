'use strict';

var helper = require('async-helper-base');

/**
 * Transform for loading default async helpers
 */

module.exports = function async_(app) {
  app.asyncHelper('include', helper('include'));
};

'use strict';

var helper = require('async-helper-base');

/**
 * Transform for loading default async helpers
 */

module.exports = function async_(verb) {
  verb.asyncHelper('include', helper('include'));
};

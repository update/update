'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

// type utils
require('for-own');
require('mixin-deep', 'merge');

// engine/template utiles
require('parser-front-matter', 'matter');
require('question-cache', 'questions');
require('resolve-dir', 'resolve');
require('data-store', 'store');
require = fn;

/**
 * Expose utils
 */

module.exports = utils;

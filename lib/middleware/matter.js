'use strict';

var parser = require('parser-front-matter');
var extend = require('extend-shallow');

/**
 * Default middleware for parsing front-matter
 */

module.exports = function matter(app) {
  return function (file, next) {
    var opts = extend({}, app.options.matter, file.options);
    return parser.parse(file, opts, next);
  };
};

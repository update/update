'use strict';

var parser = require('parser-front-matter');

/**
 * Default middleware for parsing front-matter
 */

module.exports = function matter(app) {
  return function (file, next) {
    return parser.parse(file, next);
  };
};

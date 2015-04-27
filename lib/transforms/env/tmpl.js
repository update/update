'use strict';

var path = require('path');

/**
 * Get/set the current working directory
 *
 * ```js
 * console.log(app.templates);
 * //=> /dev/foo/bar/
 * ```
 * Or set:
 *
 * ```js
 * app.templates = 'foo';
 * ```
 */

module.exports = function templates_(app) {
  var dir = app.option('templates');

  if (typeof dir === 'undefined') {
    dir = path.join(process.cwd(), 'templates');
  }

  app.set('paths.templates');
};

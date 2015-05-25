'use strict';

/**
 * Expose `utils/` modules on `utils`
 */

var utils = require('export-files')(__dirname);

/**
 * Detect if the user has specfied not to render a vinyl template.
 *
 * @return {Boolean}
 */

utils.norender = function norender(app, file, locals) {
  return app.isTrue('norender') || app.isFalse('render')
    || file.norender === true || file.render === false
    || locals.norender === true || locals.render === false;
};

/**
 * Coerce value to an array
 *
 * @api private
 */

utils.arrayify = function arrayify(val) {
  if (typeof val !== 'string' && !Array.isArray(val)) {
    throw new TypeError('app#utils.arrayify expects val to be a string or array.');
  }
  return !Array.isArray(val) ? [val] : val;
};

/**
 * Expose `utils`
 */

module.exports = utils;

'use strict';

var path = require('path');
var cwd = require('cwd');

/**
 * Load built-in template types
 */

module.exports = function load_(app) {
  var includes = tryRequire(app.config.get('includes'), './includes');
  app.includes('**/*.md', { cwd: includes, cache: true });
};

function tryRequire(name, fallback) {
  if (typeof name === 'string') {
    try {
      return require(name);
    } catch(err) {
      try {
        return require(path.resolve(name));
      } catch(err) {}
      return path.resolve(fallback);
    }
  } else {
    try {
      return require(fallback);
    } catch(err) {
      return path.resolve(fallback);
    }
  }
}

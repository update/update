'use strict';

/**
 * Remove the old verb
 */

exports.removeVerb = function(pkg) {
  if (pkg && pkg.devDependencies && pkg.devDependencies['verb-tag-jscomments']) {
    delete pkg.devDependencies['verb-tag-jscomments'];
    delete pkg.devDependencies.verb;
  }

  if (pkg && pkg.devDependencies && pkg.devDependencies.verb) {
    var version = stripNonNumber(pkg.devDependencies.verb).split('.');
    if (version[1] < 3) {
      delete pkg.devDependencies.verb;
    } else if (version[1] >= 3) {
      pkg.devDependencies.verb = '^0.5.0';
    }
  }
  return pkg;
};

function stripNonNumber(str) {
  return str.replace(/^[\D\s]+/, '');
}

/**
 * Remove `should` when it's not being used
 * in tests.
 */

exports.removeShould = function(pkg) {
  if (pkg && pkg.devDependencies) {
    delete pkg.devDependencies.should;
  }
  return pkg;
};

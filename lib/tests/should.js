'use strict';

var logger = require('../logging');

module.exports = function should(file, verb) {
  var str = file.contents.toString();
  var log = logger(str);

  // does package.json have `devDependencies`?
  var devDeps = verb.env && verb.env.devDependencies;

  // does `should` exists in test files?
  var has = /var.*should\s*=\s*require/.test(str);

  // if so, is it used?
  var used = /\.should\./.test(str);

  if (has && devDeps) {
    // if `should` is *not* used
    // - strip if from test files
    // - delete it from package.json
    if (!used) {
      str = stripRequires(str);
      delete verb.pkg.devDependencies.should;

    } else {
      // if `should` *is* used
      // - format it properly in test files
      // - ensure it's in package.json
      str = fixRequires(str);
      // TODO: get the latest version from npm
      verb.pkg.devDependencies.should = '^0.5.0';
    }
  }

  log.results(str, 'updated "should" statements in', file.relative);
  file.contents = new Buffer(str);
  return file;
};


var re = /var should[^\n]+/;

function fixRequires(str) {
  return str.replace(re, 'require(\'should\');');
}

function stripRequires(str) {
  return str.replace(re, '');
}



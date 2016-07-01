'use strict';

var through = require('through2');

module.exports = function(app) {
  var paths = [];

  return through.obj(function(file, enc, next) {
    paths.push(file.basename);
    next();
  }, function(cb) {
    console.log();
    console.log('- ' + paths.join('\n- '));
    console.log();
    console.log(app.log.magenta(paths.length + ' updaters installed'));
    console.log();
    cb();
  });
};

'use strict';

var through = require('through2');

module.exports = function() {
  var paths = [];

  return through.obj(function(file, enc, next) {
    paths.push(file.basename);
    next();
  }, function(cb) {
    console.log('- ' + paths.join('\n- '));
    console.log();
    console.log(paths.length + ' updaters installed');
    cb();
  });
};

'use strict';

var path = require('path');
var through = require('through2');
var merge = require('merge-deep');
var sortObj = require('sort-object');

module.exports = function pkg() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer() || path.basename(file.path) !== 'package.json') {
      this.push(file);
      return cb();
    }

    var obj = JSON.parse(file.contents.toString());
    obj = merge(obj, {
      foofoo: 'bar',
      files: ['index.js'],
      scripts: {
        test: 'mocha'
      }
    });

    obj = sortObj(obj, [
      'name',
      'description',
      'version',
      'homepage',
      'author ',
      'repository',
      'bugs',
      'license',
      'files',
      'main',
      'preferGlobal',
      'bin',
      'engines',
      'scripts',
      'dependencies',
      'devDependencies',
      'keywords'
    ]);

    file.contents = new Buffer(JSON.stringify(obj, null, 2));
    console.log('package.json updated');
    this.push(file);
    cb();
  });
};


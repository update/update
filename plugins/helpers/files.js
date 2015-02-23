'use strict';

var fs = require('fs');
var path = require('path');
var unique = require('array-unique');
var intersect = require('array-intersection');
var utils = require('../../lib/utils');

exports.toFiles = function(fp, names) {
  var lookFor = names || ['index.js', 'cli.js', 'lib/', 'bin/', 'completion/', 'templates/'];
  var files = fs.readdirSync(path.resolve(fp));
  names = formatFiles(names);
  files = formatFiles(files);
  return unique(intersect(lookFor, files).concat(names));
};

function formatFiles(files) {
  var res = [], i = 0;
  var len;
  if (files && (len = files.length)) {
    while (len--) {
      var file = files[i++];
      var stat = fs.statSync(file);
      res.push(utils.trailingSlash(file, stat));
    }
  }
  return res;
}

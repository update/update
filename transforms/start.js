'use strict';

var fs = require('fs');
var del = require('del');
var path = require('path');
var verb = require('verb');
var glob = require('glob');
var gutil = require('gulp-util');
var parse = require('parse-copyright');

var logger = require('../lib/logging');
var plugins = require('../plugins')(verb);
var verbmd = require('../plugins/readme/verbmd');
var utils = require('../lib/utils');
var log = logger({nocompare: true});

module.exports = function (verb) {
  verb.set('stats.hasTravis', verb.exists('.travis.yml'));
  var verbfile = verb.files('.verb*');

  if (verbfile.length) {
    var fp = verbfile[0];
    var str = utils.antimatter(fp);
    str = verbmd(str, verb);
    utils.writeFile(fp, str);
  }
};

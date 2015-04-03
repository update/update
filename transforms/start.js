'use strict';

var debug = require('debug')('update:transform');
var verbmd = require('../plugins/readme/verbmd');
var utils = require('../lib/utils');

module.exports = function (verb) {
  debug('transform: start');

  verb.set('stats.hasTravis', verb.exists('.travis.yml'));
  var verbfile = verb.files('.verb*');

  if (verbfile.length) {
    var fp = verbfile[0];
    var str = utils.antimatter(fp);
    str = verbmd(str, verb);
    utils.writeFile(fp, str);
  }
};

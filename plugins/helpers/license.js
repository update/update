'use strict';

var typeOf = require('kind-of');
var debug = require('debug')('update:helpers');
var utils = require('../../lib/utils');

exports.normalize = function license_(pkg) {
  debug('helpers:license %j', pkg);
  var license = pkg.license;

  if (!license) { return pkg; }
  var type = typeOf(license);

  if (type === 'string') {
    license = {type: license};
  }

  if (type === 'object' && license.url && utils.contains(license.url, 'LICENSE-MIT')) {
    license.url = license.url.split('LICENSE-MIT').join('LICENSE');
  }
  return pkg;
};

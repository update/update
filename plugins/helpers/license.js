'use strict';

var typeOf = require('kind-of');
var utils = require('../../lib/utils');

exports.normalize = function normalize(pkg) {
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

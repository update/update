'use strict';

var debug = require('debug')('update:helpers');

exports.normalize = function licenses_(pkg) {
  debug('helpers:licenses %j', pkg);
  var licenses = pkg.licenses;

  if (Array.isArray(licenses) && licenses.length === 1) {
    pkg.license = pkg.licenses[0];
    delete pkg.licenses;
  }
  return pkg;
};

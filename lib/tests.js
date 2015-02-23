'use strict';

exports.fixShould = function fixShould(str) {
  var segs = str.split('var should = require(\'should\');');
  return segs.join('require(\'should\');');
};

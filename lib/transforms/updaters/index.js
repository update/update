'use strict';

var transforms = require('export-files')(__dirname);

module.exports = function updaters_(update) {
  this.transform('updaters', transforms.updaters);
};

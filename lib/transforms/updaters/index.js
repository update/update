'use strict';

var transforms = require('export-files')(__dirname);

module.exports = function updaters_(app) {
  app.transform('updaters', transforms.updaters);
};

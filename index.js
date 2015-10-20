/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var ask = require('assemble-ask');
var Core = require('assemble-core');
var plugin = require('./lib/plugins');
var utils = require('./lib/utils');

function Update(options) {
  if (!(this instanceof Update)) {
    return new Update(options);
  }
  Core.call(this, options);
  this.initUpdater(this.options);
}

/**
 * Inherit assemble-core
 */

Core.extend(Update);

/**
 * Initialize Updater defaults
 */

Update.prototype.initUpdater = function() {
  this.use(plugin.locals({name: 'update'}));
  this.use(plugin.store({name: 'update'}));
  // this.use(plugin.config());
  // this.use(plugin.reloadViews());
  this.use(ask());

  this.engine('md', require('engine-base'), {
    delims: ['{%', '%}']
  });

  this.onLoad(/\.md$/, function (view, next) {
    utils.matter.parse(view, next);
  });
};


/**
 * Expose `Update`
 */

module.exports = Update;

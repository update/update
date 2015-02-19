/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (verb) {
 return {
    banners  : require('./banners.js'),
    copyright: require('./copyright.js')(verb),
    dotfiles : require('./dotfiles.js'),
    index    : require('./index.js'),
    jshint   : require('./jshint.js'),
    pkg      : require('./pkg.js'),
    verbfile : require('./verbfile.js')(verb)
  }
};

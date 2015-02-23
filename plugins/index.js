/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (verb) {
 return {
    banners   : require('./banners.js')(verb),
    dotfiles  : require('./dotfiles.js'),
    index     : require('./index.js'),
    gitignore : require('./gitignore.js'),
    jshint    : require('./jshint.js'),
    license   : require('./license.js'),
    pkg       : require('./pkg.js')(verb),
    tests     : require('./tests.js')(verb),
    travis    : require('./travis.js')(verb),
    verbmd    : require('./verbmd.js')(verb)
  };
};

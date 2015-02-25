/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (verb) {
 return {
    banners       : require('./banners.js')(verb),
    dotfiles      : require('./dotfiles.js')(verb),
    editorconfig  : require('./editorconfig.js')(verb),
    gitignore     : require('./gitignore.js')(verb),
    jshint        : require('./jshint.js')(verb),
    license       : require('./license.js')(verb),
    pkg           : require('./pkg.js')(verb),
    tests         : require('./tests.js')(verb),
    travis        : require('./travis.js')(verb),
    verbmd        : require('./verbmd.js')(verb)
  };
};

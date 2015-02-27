'use strict';

// module.exports = require('export-files')(__dirname);

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
    travis        : require('./travis.js')(verb)
  };
};

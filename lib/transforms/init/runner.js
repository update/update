'use strict';

/**
 * The current `app.runner`
 */

module.exports = function runner_(app) {
  app.data({
    runner: {
      name: 'app-cli',
      url: 'https://github.com/assemble/app-cli'
    }
  });
};

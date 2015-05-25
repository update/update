'use strict';

/**
 * Metadata for the current `app.runner`
 */

module.exports = function(app) {
  app.data({
    runner: {
      name: 'update',
      url: 'https://github.com/jonschlinkert/update'
    }
  });
};

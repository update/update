'use strict';

/**
 * Reload views when a user changes settings.
 *
 * Initializes event listeners to listen for events
 * that indicate if something needs to be re-initialized
 * based on user options.
 */

module.exports = function (key) {
  return function (app) {
    this.only('reloadViews', 'option', function (key) {
      reloadViews(app, key);
    });

    this.only('reloadViews', 'use', function () {
      reloadViews(app);
    });

    function reloadViews(key) {
      for (var name in app.views) {
        if (app.views.hasOwnProperty(name)) {
          var views = app.views[name];

          if (!key || typeof app[name][key] !== 'function') {
            app.create(name, app[name].options);
            app[name].addViews(views);
          }
        }
      }
    }
  };
};

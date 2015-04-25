'use strict';

var path = require('path');

/**
 * Rename dotfile templates.
 */

module.exports = function (app) {
  var dotfiles = app.disabled('dotfiles');

  return function dotfiles_(file, next) {
    if (dotfiles) return next();

    dotfiles = app.disabled('dotfiles');
    if (dotfiles) return next();

    if (file.path.indexOf('templates/dotfiles') !== -1) {
      var dirname = path.dirname(file.path);
      var basename = path.basename(file.path);
      if (basename[0] !== '.') {
        basename = '.' + basename;
      }
      file.path = path.join(dirname, basename);
    }
    next();
  }
}

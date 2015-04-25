'use strict';

/**
 * Module dependencies.
 */

var PluginError = require('../utils/error');
var through = require('through2');
var utils = require('utils');

/**
 * Expose `render` plugin
 */

module.exports = plugin('update');

function plugin(appname) {
  return function render_(locals) {
    var app = this;
    locals = locals || {};
    locals.options = locals.options || {};

    return through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        this.push(file);
        return cb();
      }
      if (file.isStream()) {
        this.emit('error', new PluginError(appname + '-render', 'Streaming is not supported.'));
        return cb();
      }

      var template = app.getFile(file);
      template.content = file.contents.toString();

      locals = utils.merge({}, locals, file.locals);
      locals.options = utils.merge({}, locals.options, app.options);

      if (norender(app, file.ext, file, locals)) {
        this.push(file);
        return cb();
      }

      try {
        var stream = this;
        template.render(locals, function(err, content) {
          if (err) {
            stream.emit('error', new PluginError(appname + '-render', err));
            cb(err);
            return;
          }

          file.contents = new Buffer(content);
          stream.push(file);
          cb();
        });

      } catch (err) {
        this.emit('error', new PluginError(appname + '-render', err));
        return cb();
      }
    });
  }
}

/**
 * Push the `file` through if the user has specfied
 * not to render it.
 */

function norender(app, ext, file, locals) {
  return !app.engines.hasOwnProperty(ext)
    || app.enabled('norender') || app.disabled('render')
    || file.norender === true || file.render === false
    || locals.norender === true || locals.render === false;
}

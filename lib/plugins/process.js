'use strict';

var PluginError = require('plugin-error');
var through = require('through2');
var utils = require('utils');

/**
 * Expose `process` plugin
 */

module.exports = plugin('update');

function plugin(appname) {
  return function (locals) {
    var app = this;
    return through.obj(function (file, enc, cb) {
      var collection = app.inflections[locals.id];
      var template = app.views[collection][file.id];

      template.content = file.contents.toString();
      var context = utils.extend({}, locals, file.locals);

      try {
        var stream = this;
        app.render(template, context, function (err, content) {
          if (err) {
            stream.emit('error', new PluginError(appname + '-process', err));
            return cb(err);
          }
          file.contents = new Buffer(content);
          stream.push(file);
          cb();
        });
      } catch (err) {
        this.emit('error', new PluginError(appname + '-process', err));
        return cb();
      }
    });
  };
}

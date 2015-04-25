'use strict';

var through = require('through2');
var utils_ = require('utils');
var utils = require('../utils');

/**
 * Expose `process` plugin
 */

module.exports = plugin('update');

function plugin(appname) {
  return function (locals, options) {
    var app = this;
    return function (file, enc, cb) {
      var collection = app.inflections[locals.id];
      var template = app.views[collection][file.id];

      template.content = file.contents.toString();
      var context = utils_.extend({}, locals, file.locals);

      try {
        var stream = this;
        app.render(template, context, function (err, content) {
          if (err) {
            stream.emit('error', new utils.PluginError(appname + '-process', err));
            return cb(err);
          }
          file.contents = new Buffer(content);
          stream.push(file);
          cb();
        });
      } catch (err) {
        this.emit('error', new utils.PluginError(appname + '-process', err));
        return cb();
      }
    };
  };
};

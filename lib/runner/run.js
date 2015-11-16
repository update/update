'use strict';

var utils = require('../utils');

module.exports = function(options) {
  return function(app) {

    this.define('run', function(args, cb) {
      if (typeof args === 'function') {
        cb = args;
        args = null;
      }

      if (!args) {
        var commands = this.options.commands || this.commands;
        args = this.argv(this.base.get('argv'), commands);
      }

      if (args.commands && args.commands.length > 1) {
        var cmd = '"' + args.commands.join(', ') + '"';
        return cb(new Error('Error: only one root level command may be given: ' + cmd));
      }

      this.base.cli.process(args.flags);
      var updaters = Object.keys(args.updaters);

      utils.async.eachSeries(updaters, function(name, next) {
        var tasks = args.updaters[name];
        var app = name !== 'base' ? this.base.updater(name) : this.base;

        this.emit('task', name, tasks);
        app.build(tasks, function(err) {
          if (err) return next(err);
          next();
        });
      }.bind(this), cb);
      return this;
    });
  };
};

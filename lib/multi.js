'use strict';

var path = require('path');
var Emitter = require('component-emitter');
var fns = require('./middleware');
var tasks = require('./tasks');
var utils = require('./utils');
var Update = require('..');

module.exports = function(namespace, config) {
  function Multi(argv, options) {
    if (!(this instanceof Multi)) {
      return new Multi(argv, options);
    }

    this.options = options || {};
    this.commands = ['set', 'get', 'del', 'store', 'init', 'option', 'data'];
    this.base = new Update()
      .on('error', console.error)
      .set('argv', argv);

    for (var fn in fns) {
      fns[fn](this.base, this);
    }

    for (var key in tasks) {
      this.base.task(key, tasks[key](this.base, this));
    }

    if (this.base.disabled('verbose')) {
      this.emit = function () {}
      this.on = function () {}
    }
    this._listen();
  }

  Emitter(Multi.prototype);

  Multi.prototype._listen = function() {
    var store = ['store.set', 'store.has', 'store.get', 'store.del'];
    var methods = ['set', 'has', 'get', 'del', 'option', 'data'];

    var names = store.concat(methods);
    var len = names.length, i = -1;
    var multi = this;

    while (++i < len) {
      var method = names[i];
      var prop = method.split('.');

      if (prop.length === 2) {
        this.base[prop[0]].on(prop[1], multi.emit.bind(multi, method));
        this.base[prop[0]].on(prop[1], multi.emit.bind(multi, '*', method));
      } else {
        this.base.on(method, function(key, val) {
          multi.emit(method, key, val);
          multi.emit('*', method, key, val);
        });
      }
    }
  };

  Multi.prototype.argv = function(argv, commands, updaters) {
    var res = {};
    res.updaters = updaters;
    res.argv = argv;
    res.commands = [];
    res.updaters = {};

    var files = argv.files ? utils.pick(argv, 'files') : null;
    res.flags = utils.expandArgs(utils.omit(argv, ['_', 'files']));
    if (files) res.flags.files = files;
    res.flagskeys = Object.keys(res.flags);

    var arr = argv._;
    var len = arr.length, i = -1;

    while (++i < len) {
      var ele = arr[i];

      if (/\W/.test(ele)) {
        var obj = utils.expand(ele);
        utils.forOwn(obj, function (val, key) {
          utils.union(res.updaters, key, val);
        });
        continue;
      }

      if (utils.contains(commands, ele)) {
        res.commands.push(ele);
        continue;
      }

      if (ele in updaters) {
        utils.union(res.updaters, ele, 'default');

      } else if (ele !== 'base') {
        utils.union(res.updaters, 'base', ele);
      }
    }
    return res;
  };

  Multi.prototype.register = function(pattern, options) {
    utils.matchFiles(pattern, options).forEach(function (fp) {
      var fullname = utils.projectName(fp);
      var name = utils.renameFn(fullname, options);
      var mod = utils.resolveModule(fp) || Update;
      var app = mod(this.base.options)
        .option('name', name)
        .set('fullname', fullname)
        .set('path', fp);

      var filepath = path.join(fp, 'updatefile.js');

      require(filepath)(app, this);
      this.base.updater(name, app);

      this.emit('register', name, app);
    }.bind(this));
    return this;
  };

  Multi.prototype.run = function(args, cb) {
    if (typeof args === 'function') {
      cb = args;
      args = null;
    }

    if (!args) {
      var argv = this.base.get('argv');
      var commands = this.options.commands || this.commands;
      args = this.argv(argv, commands, this.base.updaters);
    }

    if (args.commands && args.commands.length > 1) {
      var cmd = '"' + args.commands.join(', ') + '"';
      return cb(new Error('Error: only one root level command may be given: ' + cmd));
    }

    this.base.cli.process(args.flags);
    var updaters = Object.keys(args.updaters);

    utils.async.eachSeries(updaters, function(name, next) {
      var tasks = args.updaters[name];
      var app = name !== 'base'
        ? this.base.updater(name)
        : this.base;

      this.emit('task', name, tasks);
      app.build(tasks, function (err) {
        if (err) return next(err);
        next();
      });
    }.bind(this), cb);
    return this;
  };

  Multi.prototype.list = function(cb) {
    var questions = utils.questions(this.base.options);
    var question = {
      updaters: {
        message: 'pick an updater to run',
        type: 'checkbox',
        choices: utils.list(this.base.updaters)
      }
    };

    questions.ask(question, function (err, answers) {
      if (err) return cb(err);
      var args = {
        updaters: {}
      };
      answers.updaters.forEach(function (answer) {
        var segs = answer.split(':');
        utils.union(args.updaters, segs[0], (segs[1] || 'default').split(','));
      });
      return cb(null, args);
    });
  };

  /**
   * Expose `Multi`
   */

  return Multi;
};

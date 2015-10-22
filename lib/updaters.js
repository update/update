'use strict';

var path = require('path');
var fns = require('./middleware');
var tasks = require('./tasks');
var utils = require('./utils');
var Update = require('..');

function Updaters(argv, options) {
  if (!(this instanceof Updaters)) {
    return new Updaters(argv);
  }

  this.options = options || {};
  this.base = new Update()
    .on('error', console.error)
    .use(utils.runtimes())
    .set('argv', argv);

  for (var fn in fns) {
    fns[fn](this.base, this);
  }

  for (var key in tasks) {
    this.base.task(key, tasks[key](this.base, this));
  }
}

Updaters.prototype.argv = function(argv, whitelist, updaters) {
  var res = {};
  res.whitelist = whitelist;
  res.updaters = updaters;
  res.argv = argv;
  res.commands = [];
  res.updaters = {};
  res.flags = utils.expandArgs(utils.omit(argv, '_'));

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

    if (utils.contains(whitelist, ele)) {
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

Updaters.prototype.register = function(pattern, options) {
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
  }.bind(this));
  return this;
};

Updaters.prototype.run = function(args, cb) {
  if (typeof args === 'function') {
    cb = args;
    args = null;
  }

  if (!args) {
    var whitelist = this.options.whitelist || ['set', 'get', 'del', 'store', 'init'];
    var argv = this.base.get('argv');
    args = this.argv(argv, whitelist, this.base.updaters);
  }

  if (args.commands && args.commands.length > 1) {
    var cmd = '"' + args.commands.join(', ') + '"';
    return cb(new Error('Error: only one root level command may be given: ' + cmd));
  }

  var updaters = Object.keys(args.updaters);

  utils.async.eachSeries(updaters, function(name, next) {
    var tasks = args.updaters[name];
    var app = name !== 'base'
      ? this.base.updater(name)
      : this.base;

    app.build(tasks, function (err) {
      if (err) return next(err);
      next();
    });
  }.bind(this), cb);
  return this;
};

Updaters.prototype.list = function(cb) {
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
 * Expose `Updaters`
 */

module.exports = Updaters;

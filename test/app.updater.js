'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Base = require('..');
var base;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');

describe('.updater', function() {
  beforeEach(function() {
    base = new Base();

    base.option('toAlias', function(key) {
      return key.replace(/^updater-(.*)/, '$1');
    });
  });

  describe('updater', function() {
    it('should get an updater by alias', function() {
      base.register('updater-example', require('updater-example'));
      var gen = base.getUpdater('example');
      assert(gen);
      assert.equal(gen.env.name, 'updater-example');
      assert.equal(gen.env.alias, 'example');
    });

    it('should get an updater using a custom lookup function', function() {
      base.register('updater-foo', function() {});
      base.register('updater-bar', function() {});

      var gen = base.getUpdater('foo', {
        lookup: function(key) {
          return ['updater-' + key, 'verb-' + key + '-updater', key];
        }
      });

      assert(gen);
      assert.equal(gen.env.name, 'updater-foo');
      assert.equal(gen.env.alias, 'foo');
    });
  });

  describe('register > function', function() {
    it('should register an updater function by name', function() {
      base.updater('foo', function() {});
      assert(base.updaters.hasOwnProperty('foo'));
    });

    it('should register an updater function by alias', function() {
      base.updater('updater-abc', function() {});
      assert(base.updaters.hasOwnProperty('updater-abc'));
    });
  });

  describe('get > alias', function() {
    it('should get an updater by alias', function() {
      base.updater('updater-abc', function() {});
      var abc = base.updater('abc');
      assert(abc);
      assert.equal(typeof abc, 'object');
    });
  });

  describe('get > name', function() {
    it('should get an updater by name', function() {
      base.updater('updater-abc', function() {});
      var abc = base.updater('updater-abc');
      assert(abc);
      assert.equal(typeof abc, 'object');
    });
  });

  describe('updaters', function() {
    it('should invoke a registered updater when `getGenerator` is called', function(cb) {
      base.register('foo', function(app) {
        app.task('default', function() {});
        cb();
      });
      base.getGenerator('foo');
    });

    it('should expose the updater instance on `app`', function(cb) {
      base.register('foo', function(app) {
        app.task('default', function(next) {
          assert.equal(app.get('a'), 'b');
          next();
        });
      });

      var foo = base.getGenerator('foo');
      foo.set('a', 'b');
      foo.build('default', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should expose the "base" instance on `base`', function(cb) {
      base.set('x', 'z');
      base.register('foo', function(app, base) {
        app.task('default', function(next) {
          assert.equal(base.get('x'), 'z');
          next();
        });
      });

      var foo = base.getGenerator('foo');
      foo.set('a', 'b');
      foo.build('default', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should expose the "env" object on `env`', function(cb) {
      base.register('foo', function(app, base, env) {
        app.task('default', function(next) {
          assert.equal(env.alias, 'foo');
          next();
        });
      });

      base.getGenerator('foo').build('default', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should expose an app\'s updaters on app.updaters', function(cb) {
      base.register('foo', function(app) {
        app.register('a', function() {});
        app.register('b', function() {});

        app.updaters.hasOwnProperty('a');
        app.updaters.hasOwnProperty('b');
        cb();
      });

      base.getGenerator('foo');
    });

    it('should expose all root updaters on base.updaters', function(cb) {
      base.register('foo', function(app, b) {
        b.updaters.hasOwnProperty('foo');
        b.updaters.hasOwnProperty('bar');
        b.updaters.hasOwnProperty('baz');
        cb();
      });

      base.register('bar', function(app, base) {});
      base.register('baz', function(app, base) {});
      base.getGenerator('foo');
    });
  });

  describe('cross-updaters', function() {
    it('should get an updater from another updater', function(cb) {
      base.register('foo', function(app, b) {
        var bar = b.getGenerator('bar');
        assert(bar);
        cb();
      });

      base.register('bar', function(app, base) {});
      base.register('baz', function(app, base) {});
      base.getGenerator('foo');
    });

    it('should set options on another updater instance', function(cb) {
      base.updater('foo', function(app) {
        app.task('default', function(next) {
          assert.equal(app.option('abc'), 'xyz');
          next();
        });
      });

      base.updater('bar', function(app, b) {
        var foo = b.getGenerator('foo');
        foo.option('abc', 'xyz');
        foo.build(function(err) {
          if (err) return cb(err);
          cb();
        });
      });
    });
  });

  describe('updaters > filepath', function() {
    it('should register an updater function from a file path', function() {
      var one = base.updater('one', fixtures('one/updatefile.js'));
      assert(base.updaters.hasOwnProperty('one'));
      assert(typeof base.updaters.one === 'object');
      assert.deepEqual(base.updaters.one, one);
    });

    it('should get a registered updater by name', function() {
      var one = base.updater('one', fixtures('one/updatefile.js'));
      assert.deepEqual(base.updater('one'), one);
    });
  });

  describe('tasks', function() {
    it('should expose an updater\'s tasks on app.tasks', function(cb) {
      base.register('foo', function(app) {
        app.task('a', function() {});
        app.task('b', function() {});
        assert(app.tasks.a);
        assert(app.tasks.b);
        cb();
      });

      base.getGenerator('foo');
    });

    it('should get tasks from another updater', function(cb) {
      base.register('foo', function(app, b) {
        var baz = b.getGenerator('baz');
        var task = baz.tasks.aaa;
        assert(task);
        cb();
      });

      base.register('bar', function(app, base) {});
      base.register('baz', function(app, base) {
        app.task('aaa', function() {});
      });
      base.getGenerator('foo');
    });
  });

  describe('namespace', function() {
    it('should expose `app.namespace`', function(cb) {
      base.updater('foo', function(app) {
        assert(typeof app.namespace, 'string');
        cb();
      });
    });

    it('should create namespace from updater alias', function(cb) {
      base.updater('updater-foo', function(app) {
        assert.equal(app.namespace, base._name + '.foo');
        cb();
      });
    });

    it('should create sub-updater namespace from parent namespace and alias', function(cb) {
      var name = base._name;
      base.updater('updater-foo', function(app) {
        assert.equal(app.namespace, name + '.foo');

        app.updater('updater-bar', function(bar) {
          assert.equal(bar.namespace, name + '.foo.bar');

          bar.updater('updater-baz', function(baz) {
            assert.equal(baz.namespace, name + '.foo.bar.baz');

            baz.updater('updater-qux', function(qux) {
              assert.equal(qux.namespace, name + '.foo.bar.baz.qux');
              cb();
            });
          });
        });
      });
    });

    it('should expose namespace on `this`', function(cb) {
      var name = base._name;

      base.updater('updater-foo', function(app, first) {
        assert.equal(this.namespace, base._name + '.foo');

        this.updater('updater-bar', function() {
          assert.equal(this.namespace, base._name + '.foo.bar');

          this.updater('updater-baz', function() {
            assert.equal(this.namespace, base._name + '.foo.bar.baz');

            this.updater('updater-qux', function() {
              assert.equal(this.namespace, base._name + '.foo.bar.baz.qux');
              assert.equal(app.namespace, base._name + '.foo');
              assert.equal(first.namespace, base._name);
              cb();
            });
          });
        });
      });
    });
  });
});

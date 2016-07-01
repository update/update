'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var generators = require('base-generators');
var Base = require('..');
var base;

var fixtures = path.resolve.bind(path, __dirname + '/fixtures');

describe('.register', function() {
  beforeEach(function() {
    base = new Base();
  });

  describe('function', function() {
    it('should register an updater a function', function() {
      base.register('foo', function() {});
      var foo = base.getGenerator('foo');
      assert(foo);
      assert.equal(foo.env.alias, 'foo');
    });

    it('should get a task from an updater registered as a function', function() {
      base.register('foo', function(foo) {
        foo.task('default', function() {});
      });
      var updater = base.getGenerator('foo');
      assert(updater);
      assert(updater.tasks);
      assert(updater.tasks.hasOwnProperty('default'));
    });

    it('should get an updater from an updater registered as a function', function() {
      base.register('foo', function(foo) {
        foo.register('bar', function(bar) {});
      });
      var bar = base.getGenerator('foo.bar');
      assert(bar);
      assert.equal(bar.env.alias, 'bar');
    });

    it('should get a sub-updater from an updater registered as a function', function() {
      base.register('foo', function(foo) {
        foo.register('bar', function(bar) {
          bar.task('something', function() {});
        });
      });
      var bar = base.getGenerator('foo.bar');
      assert(bar);
      assert(bar.tasks);
      assert(bar.tasks.hasOwnProperty('something'));
    });

    it('should get a deeply-nested sub-updater registered as a function', function() {
      base.register('foo', function(foo) {
        foo.register('bar', function(bar) {
          bar.register('baz', function(baz) {
            baz.register('qux', function(qux) {
              qux.task('qux-one', function() {});
            });
          });
        });
      });

      var qux = base.getGenerator('foo.bar.baz.qux');
      assert(qux);
      assert(qux.tasks);
      assert(qux.tasks.hasOwnProperty('qux-one'));
    });

    it('should expose the instance from each updater', function() {
      base.register('foo', function(foo) {
        foo.register('bar', function(bar) {
          bar.register('baz', function(baz) {
            baz.register('qux', function(qux) {
              qux.task('qux-one', function() {});
            });
          });
        });
      });

      var qux = base
        .getGenerator('foo')
        .getGenerator('bar')
        .getGenerator('baz')
        .getGenerator('qux');

      assert(qux);
      assert(qux.tasks);
      assert(qux.tasks.hasOwnProperty('qux-one'));
    });

    it('should fail when an updater that does not exist is defined', function() {
      base.register('foo', function(foo) {
        foo.register('bar', function(bar) {
          bar.register('baz', function(baz) {
            baz.register('qux', function(qux) {
            });
          });
        });
      });
      var fez = base.getGenerator('foo.bar.fez');
      assert.equal(typeof fez, 'undefined');
    });

    it('should expose the `base` instance as the second param', function(cb) {
      base.register('foo', function(foo, base) {
        assert(base.updaters.hasOwnProperty('foo'));
        cb();
      });
      base.getGenerator('foo');
    });

    it('should expose sibling updaters on the `base` instance', function(cb) {
      base.register('foo', function(foo, base) {
        foo.task('abc', function() {});
      });
      base.register('bar', function(bar, base) {
        assert(base.updaters.hasOwnProperty('foo'));
        assert(base.updaters.hasOwnProperty('bar'));
        cb();
      });

      base.getGenerator('foo');
      base.getGenerator('bar');
    });
  });

  describe('alias', function() {
    it('should use a custom function to create the alias', function() {
      base.option('toAlias', function(name) {
        return name.slice(name.lastIndexOf('-') + 1);
      });

      base.register('base-abc-xyz', function() {});
      var xyz = base.getGenerator('xyz');
      assert(xyz);
      assert.equal(xyz.env.alias, 'xyz');
    });
  });

  describe('path', function() {
    it('should register an updater function by name', function() {
      base.register('foo', function() {});
      assert(base.updaters.hasOwnProperty('foo'));
    });

    it('should register an updater function by alias', function() {
      base.register('abc', function() {});
      assert(base.updaters.hasOwnProperty('abc'));
    });

    it('should register an updater by dirname', function() {
      base.register('a', fixtures('updaters/a'));
      assert(base.updaters.hasOwnProperty('a'));
    });

    it('should register an updater from a configfile filepath', function() {
      base.register('base-abc', fixtures('updaters/a/updatefile.js'));
      assert(base.updaters.hasOwnProperty('base-abc'));
    });

    it('should throw when an updater does not expose the instance', function(cb) {
      try {
        base.register('not-exposed', require(fixtures('not-exposed.js')));
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, `cannot resolve: 'not-exposed'`);
        cb();
      }
    });
  });

  describe('instance', function() {
    it('should register an instance', function() {
      base.register('base-inst', new Base());
      assert(base.updaters.hasOwnProperty('base-inst'));
    });

    it('should get an updater that was registered as an instance', function() {
      var foo = new Base();
      foo.task('default', function() {});
      base.register('foo', foo);
      assert(base.getGenerator('foo'));
    });

    it('should register multiple instances', function() {
      var foo = new Base();
      var bar = new Base();
      var baz = new Base();
      base.register('foo', foo);
      base.register('bar', bar);
      base.register('baz', baz);
      assert(base.getGenerator('foo'));
      assert(base.getGenerator('bar'));
      assert(base.getGenerator('baz'));
    });

    it('should get tasks from an updater that was registered as an instance', function() {
      var foo = new Base();
      foo.task('default', function() {});
      base.register('foo', foo);
      var updater = base.getGenerator('foo');
      assert(updater);
      assert(updater.tasks.hasOwnProperty('default'));
    });

    it('should get sub-updaters from an updater registered as an instance', function() {
      var foo = new Base();
      foo.use(generators());
      foo.register('bar', function() {});
      base.register('foo', foo);
      var updater = base.getGenerator('foo.bar');
      assert(updater);
    });

    it('should get tasks from sub-updaters registered as an instance', function() {
      var foo = new Base();
      foo.use(generators());

      foo.options.isFoo = true;
      foo.register('bar', function(bar) {
        bar.task('whatever', function() {});
      });

      base.register('foo', foo);
      var updater = base.getGenerator('foo.bar');
      assert(updater.tasks);
      assert(updater.tasks.hasOwnProperty('whatever'));
    });
  });
});

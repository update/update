'use strict';

var path = require('path');
var assert = require('assert');
var Base = require('..');
var base;

var fixtures = path.resolve.bind(path, __dirname + '/fixtures');

describe('.updater', function() {
  beforeEach(function() {
    base = new Base();
  });

  it('should get a updater from the base instance', function() {
    base.register('abc', function() {});
    var updater = base.getUpdater('abc');
    assert(updater);
    assert.equal(typeof updater, 'object');
    assert.equal(updater.name, 'abc');
  });

  it('should fail when a updater is not found', function() {
    var updater = base.getUpdater('whatever');
    assert(!updater);
  });

  it('should get a updater from the base instance from a nested updater', function() {
    base.register('abc', function() {});
    base.register('xyz', function(app) {
      app.register('sub', function(sub) {
        var updater = base.getUpdater('abc');
        assert(updater);
        assert.equal(typeof updater, 'object');
        assert.equal(updater.name, 'abc');
      });
    });
    base.getUpdater('xyz');
  });

  it('should get a updater from the base instance using `this`', function() {
    base.register('abc', function() {});
    base.register('xyz', function(app) {
      app.register('sub', function(sub) {
        var updater = this.getUpdater('abc');
        assert(updater);
        assert.equal(typeof updater, 'object');
        assert.equal(updater.name, 'abc');
      });
    });
    base.getUpdater('xyz');
  });

  it('should get a base updater from "app" from a nested updater', function() {
    base.register('abc', function() {});
    base.register('xyz', function(app) {
      app.register('sub', function(sub) {
        var updater = app.getUpdater('abc');
        assert(updater);
        assert.equal(typeof updater, 'object');
        assert.equal(updater.name, 'abc');
      });
    });
    base.getUpdater('xyz');
  });

  it('should get a nested updater', function() {
    base.register('abc', function(abc) {
      abc.register('def', function(def) {});
    });

    var updater = base.getUpdater('abc.def');
    assert(updater);
    assert.equal(typeof updater, 'object');
    assert.equal(updater.name, 'def');
  });

  it('should get a deeply nested updater', function() {
    base.register('abc', function(abc) {
      abc.register('def', function(def) {
        def.register('ghi', function(ghi) {
          ghi.register('jkl', function(jkl) {
            jkl.register('mno', function() {});
          });
        });
      });
    });

    var updater = base.getUpdater('abc.def.ghi.jkl.mno');
    assert(updater);
    assert.equal(typeof updater, 'object');
    assert.equal(updater.name, 'mno');
  });

  it('should get a updater that was registered by path', function() {
    base.register('a', fixtures('updaters/a'));
    var updater = base.getUpdater('a');

    assert(updater);
    assert(updater.tasks);
    assert(updater.tasks.hasOwnProperty('default'));
  });
});

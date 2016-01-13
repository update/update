'use strict';

/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Update = support.resolve();
var update;

describe('update', function() {
  describe('constructor', function() {
    it('should create an instance of Update:', function() {
      update = new Update();
      assert(update instanceof Update);
    });

    it('should new up without new:', function() {
      update = Update();
      assert(update instanceof Update);
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      update = new Update();
    });

    it('should expose `addLeaf`', function() {
      assert(typeof update.addLeaf === 'function');
    });

    it('should expose `compose`', function() {
      assert(typeof update.compose === 'function');
    });

    it('should expose `generator`', function() {
      assert(typeof update.generator === 'function');
    });

    it('should expose `getGenerator`', function() {
      assert(typeof update.getGenerator === 'function');
    });

    it('should expose `registerPath`', function() {
      assert(typeof update.registerPath === 'function');
    });

    it('should expose `register`', function() {
      assert(typeof update.register === 'function');
    });

    it('should expose `extendGenerator`', function() {
      assert(typeof update.extendGenerator === 'function');
    });

    it('should expose `process`', function() {
      assert(typeof update.process === 'function');
    });

    it('should expose `each`', function() {
      assert(typeof update.each === 'function');
    });

    it('should expose `eachSeries`', function() {
      assert(typeof update.eachSeries === 'function');
    });

    it('should expose `scaffold`', function() {
      assert(typeof update.scaffold === 'function');
    });
  });

  describe('prototype properties', function() {
    beforeEach(function() {
      update = new Update();
    });

    it('should expose `name`', function() {
      assert(typeof update.name === 'string');
    });

    it('should expose `base`', function() {
      assert(typeof update.base === 'object');
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      update = new Update();
    });

    it('should set `name` to `base` when `_name` is defined', function() {
      assert.equal(update.name, 'base');
    });

    it('should set `name` to `base` when `_name` is not defined', function() {
      delete update._name;
      assert.equal(update.name, 'base');
    });

    it('should set `name` to `base` when `_appname` is not defined', function() {
      delete update._name;
      delete update._appname;
      assert.equal(update.name, 'base');
    });

    it('should allow name setter to be set (configurable)', function() {
      update.name = 'base';
      assert.equal(update.name, 'base');
    });

    it('should use `options.name` for `name`', function() {
      update = new Update({name: 'update'});
      delete update._name;
      assert.equal(update.name, 'update');
    });

    it('should return `this` as `base`', function() {
      update.base.should.deepEqual(update);
    });

    it('should return generator "base" as `base`', function() {
      var base = new Update();
      update.register('base', base);
      update.base.should.deepEqual(base);
    });

    it('should return update as `base`', function() {
      var child = new Update();
      update.register('child', child);
      child.base.should.deepEqual(update);
    });
  });
});

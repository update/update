'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support');
var Update = support.resolve();
var update;

describe('.pkg', function() {
  beforeEach(function() {
    update = new Update();
  });

  describe('methods', function() {
    it('should expose a pkg object', function() {
      assert(update.pkg);
      assert.equal(typeof update.pkg, 'object');
    });

    it('should expose a pkg.set method', function() {
      assert.equal(typeof update.pkg.set, 'function');
    });

    it('should expose a pkg.get method', function() {
      assert.equal(typeof update.pkg.get, 'function');
    });

    it('should expose a pkg.del method', function() {
      assert.equal(typeof update.pkg.del, 'function');
    });

    it('should expose a pkg.union method', function() {
      assert.equal(typeof update.pkg.union, 'function');
    });
  });

  describe('cwd', function() {
    it('should get the package.json from the working directory', function() {
      assert.equal(update.pkg.get('name'), 'update');
    });
  });
});

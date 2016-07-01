'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Update = require('..');
var update;

describe('update', function() {
  describe('cwd', function() {
    beforeEach(function() {
      update = new Update();
    });

    it('should get the current working directory', function() {
      assert.equal(update.cwd, process.cwd());
    });

    it('should set the current working directory', function() {
      update.cwd = 'test/fixtures';
      assert.equal(update.cwd, path.join(process.cwd(), 'test/fixtures'));
    });
  });

  describe('generator', function() {
    beforeEach(function() {
      update = new Update();
    });

    it('should register the default generator', function() {
      update.register('default', require('./fixtures/def-gen'));
      assert(update.getGenerator('default'));
    });
  });
});

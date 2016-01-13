'use strict';

var assert = require('assert');
var Update = require('..');
var update;

describe('.getGenerator', function() {
  beforeEach(function() {
    update = new Update();
  });

  it('should get a generator from the base instance', function() {
    update.register('abc', function() {});
    var generator = update.getGenerator('abc');
    assert(generator);
    assert(typeof generator === 'object');
    assert(generator.name === 'abc');
  });

  it('should get nested generator', function() {
    update.register('abc', function(abc) {
      abc.register('def', function() {});
    });

    var generator = update.getGenerator('abc.def');
    assert(generator);
    assert(typeof generator === 'object');
    assert(generator.name === 'def');
  });

  it('should get a deeply nested generator', function() {
    update.register('abc', function(abc) {
      abc.register('def', function(def) {
        def.register('ghi', function(ghi) {
          ghi.register('jkl', function(jkl) {
            jkl.register('mno', function() {});
          });
        });
      });
    });

    var generator = update.getGenerator('abc.def.ghi.jkl.mno');
    assert(generator);
    assert(typeof generator === 'object');
    assert(generator.name === 'mno');
  });
});

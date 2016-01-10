/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var Base = Generate.Base;
var update;

describe('update.register', function() {
  beforeEach(function() {
    update = new Generate();
  });

  it('should register a Generate instance', function() {
    var child = new Generate();
    update.register('child', child);
    update.generators.should.have.property('child');
    assert(typeof update.generators.child === 'object');
    update.generators.child.should.deepEqual(child);
  });

  it('should register a generator function', function() {
    var registered = false;
    var child = update.register('child', function(app, base, env) {
      registered = true;
      assert(typeof app === 'object');
      assert(app.isGenerate === true);
    });
    assert(registered);
    update.generators.should.have.property('child');
    assert(typeof update.generators.child === 'object');
    update.generators.child.should.deepEqual(child);
  });

  it('should register a non-update instance', function() {
    var child = new Base();
    update.register('child', child);
    update.generators.should.have.property('child');
    assert(typeof update.generators.child === 'object');
    update.generators.child.should.deepEqual(child);
  });

  it('should register a generator from a string', function() {
    var one = update.register('one', './test/fixtures/one/generator.js');
    update.generators.should.have.property('one');
    assert(typeof update.generators.one === 'object');
    update.generators.one.should.deepEqual(one);
  });
});

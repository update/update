/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Update = support.resolve();
var Base = Update.Base;
var update;

describe('update.register', function() {
  beforeEach(function() {
    update = new Update();
  });

  it('should register a Update instance', function() {
    var child = new Update();
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
      assert(app.isUpdate === true);
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

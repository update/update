/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Update = support.resolve();
var Base = Update.Base;
var update;

describe('update.registerPath', function() {
  beforeEach(function() {
    update = new Update();
  });

  it('should register a generator function from a filepath', function() {
    var one = update.registerPath('one', './test/fixtures/one/generator.js');
    update.generators.should.have.property('one');
    assert(typeof update.generators.one === 'object');
    update.generators.one.should.deepEqual(one);
  });

  it('should register a Update instance from a filepath', function() {
    var two = update.registerPath('two', './test/fixtures/two/updatefile.js');
    update.generators.should.have.property('two');
    assert(typeof update.generators.two === 'object');
    update.generators.two.should.deepEqual(two);
  });
});

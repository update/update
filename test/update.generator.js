/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var Base = Generate.Base;
var update;
var one;
var two;

describe('update.generator', function() {
  before(function() {
    update = new Generate();
  });

  it('should register a generator function from a file path', function() {
    one = update.generator('one', './test/fixtures/one/generator.js');
    update.generators.should.have.property('one');
    assert(typeof update.generators.one === 'object');
    update.generators.one.should.deepEqual(one);
  });

  it('should register a Generate instance from a file path', function() {
    two = update.generator('two', './test/fixtures/two/updatefile.js');
    update.generators.should.have.property('two');
    assert(typeof update.generators.two === 'object');
    update.generators.two.should.deepEqual(two);
  });

  it('should get a registered generator by name', function() {
    one = update.generator('one', './test/fixtures/one/generator.js');
    two = update.generator('two', './test/fixtures/two/updatefile.js');
    update.generator('one').should.deepEqual(one);
    update.generator('two').should.deepEqual(two);
  });
});

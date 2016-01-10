/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var Base = Generate.Base;
var update;

describe('update.compose', function() {
  beforeEach(function() {
    update = new Generate();
  });

  it('should throw an error when trying to compose an instance', function(cb) {
    var foo = new Generate({name: 'foo'});
    try {
      update.compose(foo);
      cb(new Error('Expected an error.'));
    } catch (err) {
      assert.equal(err.message, 'generators must export a function to extend other generators');
      cb();
    }
  });

  it('should compose a generator', function() {
    var foo = update.generator('foo', function(app) {
      app.task('foo', function(cb) {
        cb();
      });
    });

    var bar = update.generator('bar', function(app) {
      app.task('bar', function(cb) {
        cb();
      });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    foo.compose(bar);
    bar.tasks.should.have.property('foo');
    bar.compose(foo);
    foo.tasks.should.have.property('bar');
  });

  it('should compose a generator by name', function() {
    var foo = update.generator('foo', function(app) {
      app.task('foo', function(cb) {
        cb();
      });
    });

    var bar = update.generator('bar', function(app) {
      app.task('bar', function(cb) {
        cb();
      });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    update.compose('foo', bar);
    bar.tasks.should.have.property('foo');
    update.compose('bar', foo);
    foo.tasks.should.have.property('bar');
  });
});

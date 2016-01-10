/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Update = support.resolve();
var Base = Update.Base;
var update;

describe('update.extendGenerator', function() {
  beforeEach(function() {
    update = new Update();
  });

  it('should throw an error when trying to extend an instance', function(done) {
    var foo = new Update({name: 'foo'});
    try {
      update.extendGenerator(foo);
      done(new Error('Expected an error.'));
    } catch (err) {
      err.message.should.equal('generators must export a function to extend other generators');
      done();
    }
  });

  it('should extend a generator', function() {
    var foo = update.generator('foo', function(app) {
      app.task('foo', function(cb) { cb(); });
    });

    var bar = update.generator('bar', function(app) {
      app.task('bar', function(cb) { cb(); });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    foo.extendGenerator(bar);
    bar.tasks.should.have.property('foo');
    bar.extendGenerator(foo);
    foo.tasks.should.have.property('bar');
  });
});

'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support');
var Update = support.resolve();
var update;

describe('.config', function() {
  beforeEach(function() {
    update = new Update();
  });

  // describe('loading config', function() {
  //   it('should map "plugins" when app.config exists', function() {
  //     app.use(options());
  //     app.use(config());
  //     app.use(pipeline());
  //     assert(app.config.config.hasOwnProperty('plugins'));
  //   });

  //   it('should register plugin functions from config', function() {
  //     app.use(options());
  //     app.use(config());
  //     app.use(pipeline());
  //     var args = {
  //       plugins: {
  //         a: function() {},
  //         b: function() {},
  //         c: function() {},
  //       }
  //     };
  //     app.config.process(args);
  //     assert(app.plugins.hasOwnProperty('a'));
  //     assert(app.plugins.hasOwnProperty('b'));
  //     assert(app.plugins.hasOwnProperty('c'));
  //   });

  //   it('should register plugins from config paths', function() {
  //     app.use(options());
  //     app.use(config());
  //     app.use(pipeline());
  //     var args = {
  //       plugins: {
  //         a: 'test/fixtures/plugins/a.js',
  //         b: 'test/fixtures/plugins/b.js',
  //         c: 'test/fixtures/plugins/c.js',
  //       }
  //     };

  //     app.config.process(args);
  //     assert(app.plugins.hasOwnProperty('a'));
  //     assert(app.plugins.hasOwnProperty('b'));
  //     assert(app.plugins.hasOwnProperty('c'));

  //     assert(typeof app.plugins.a === 'function');
  //     assert(typeof app.plugins.b === 'function');
  //     assert(typeof app.plugins.c === 'function');
  //   });

  //   it('should register plugins with keys as paths', function() {
  //     app.use(options());
  //     app.use(config());
  //     app.use(pipeline());
  //     var args = {
  //       plugins: {
  //         'test/fixtures/plugins/a.js': {aaa: 'bbb'},
  //         'test/fixtures/plugins/b.js': {bbb: 'ccc'},
  //         'test/fixtures/plugins/c.js': {ddd: 'eee'}
  //       }
  //     };

  //     app.config.process(args);
  //     assert(app.plugins.hasOwnProperty('a'));
  //     assert(app.plugins.hasOwnProperty('b'));
  //     assert(app.plugins.hasOwnProperty('c'));

  //     assert(typeof app.plugins.a === 'function');
  //     assert(typeof app.plugins.b === 'function');
  //     assert(typeof app.plugins.c === 'function');
  //   });

  //   it('should throw an error when invalid config is used', function(cb) {
  //     app.use(options());
  //     app.use(config());
  //     app.use(pipeline());
  //     var args = {plugins: {'test/fixtures/plugins/a.js': null}};
  //     try {
  //       app.config.process(args);
  //       cb(new Error('expected an error'));
  //     } catch (err) {
  //       assert(err);
  //       assert(err.message);
  //       assert(/configuration/.test(err.message));
  //       cb();
  //     }
  //   });
  // });
});

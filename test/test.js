/**!
 * utils-update
 * http://github.com/helpers/utils-update
 * Copyright (c) 2013, Jon Schlinkert, contributors
 * Licensed under the MIT license.
 */

var update = require('../index.js');
var assert = require('assert');

var pkg = {
  name: 'resolve-dep',
  version: '0.1.4',
  main: 'resolve-dep.js'
};

var bower = {
  name: 'New package name',
  version: '0.1.5'
};

var author = {
  author: {
    name: 'Jon Schlinkert',
    url: 'https://github.com/jonschlinkert'
  }
};

var complex = {
  foo: {
    bar: {
      baz: {
        zuu: 'Aardvark',
        url: ['one', 'two', 'three', {four: 'five'}]
      }
    }
  }
};


describe('Update object', function () {

  it('should update the properties on an object with properties from another object', function () {
    var expected = {
      name: 'New package name',
      version: '0.1.5',
      main: 'resolve-dep.js'
    };

    var actual = update(pkg, bower);
    assert.deepEqual(expected, actual);
  });

  it('should update the properties on an object with properties from a more complex object', function () {
    var expected = {
      name: 'New package name',
      version: '0.1.5',
      author: {
        name: 'Jon Schlinkert',
        url: 'https://github.com/jonschlinkert'
      }
    };

    var actual = update(bower, author);
    assert.deepEqual(expected, actual);
  });

  it('should update the properties on an object with properties from an even more complex object', function () {
    var expected = {
      name: 'New package name',
      version: '0.1.5',
      author: {
        name: 'Jon Schlinkert',
        url: 'https://github.com/jonschlinkert'
      },
      foo: {
        bar: {
          baz: {
            zuu: 'Aardvark',
            url: ['one', 'two', 'three', {four: 'five'}]
          }
        }
      }
    };
    var foo = update(bower, author);

    var actual = update(foo, complex);
    assert.deepEqual(expected, actual);
  });

});


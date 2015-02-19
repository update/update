/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2013-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var assert = require('assert');
var update = require('./');

describe('update', function () {
  it('should update the year', function () {
    assert.equal(update('Copyright (c) 2013, Jon Schlinkert.'), 'Copyright (c) 2013-2015, Jon Schlinkert.');
    assert.equal(update('Copyright (c) 2014, Jon Schlinkert.'), 'Copyright (c) 2014-2015, Jon Schlinkert.');
    assert.equal(update('Copyright (c) 2015, Jon Schlinkert.'), 'Copyright (c) 2015, Jon Schlinkert.');
  });
});
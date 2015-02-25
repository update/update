/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
require('should');
var update = require('./');

describe('update', function () {
  it('should:', function () {
    update('a').should.equal({a: 'b'});
    update('a').should.eql('a');
  });

  it('should throw an error:', function () {
    (function () {
      update();
    }).should.throw('update expects valid arguments');
  });
});

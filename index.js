/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var parseCopyright = require('parse-copyright');
var copyright = require('update-copyright');
var license = require('update-license');
var banner = require('update-banner');
var through = require('through2');
var engine = require('engine');

engine.src('LICENSE')
  .pipe(one())
  .pipe(two())
  .pipe(engine.dest('blah'))

function one(opts) {
  return through.obj(function (file, enc, cb) {
    // console.log(file.toString())
    this.push(file);
  });
}

function two(opts) {
  return through.obj(function (file, enc, cb) {
    console.log('two');
    this.push(file);
  });
}
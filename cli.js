#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('globby');
var write = require('write');
var parseAuthor = require('parse-author');
var argv = require('minimist')(process.argv.slice(2));
var pkg = require('load-pkg');
var update = require('./');

function author(pkg) {
  if (typeof pkg.author === 'string') {
    return ', ' + parseAuthor(pkg.author).name + '.'
  }
  if (typeof pkg.author === 'object' && pkg.author.name) {
    return ', ' + pkg.author.name + '.'
  }
  return '';
}

var from = argv.f || argv.from;
var to = argv.t || argv.to || 2015;
var before = argv.b || argv.pre;
var after = argv.a || argv.post || author(pkg);

var files = glob.sync(['*.js', '*.md', 'lib/**/*.js', 'test/*.js', 'LICENS*']);
console.log();

files.forEach(function (fp) {
  fp = path.join(process.cwd(), fp);
  var str = fs.readFileSync(fp, 'utf8');
  var res = update(str, {
    from: from,
    to: to,
    pre: before,
    post: after,
  });

  write.sync(fp, res);
});

console.log('done.');

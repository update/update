'use strict';

var debug = require('debug')('update:readme');
var unique = require('array-unique');

function unknownHelpers(str, verb) {
  debug('unknownHelpers');
  var helpers = Object.keys(verb._.helpers);
  var async = Object.keys(verb._.asyncHelpers);
  var keys = unique(helpers.concat(async)).sort();

  var re = /\{%=\s*(\w+)\(([\s\S]+?)%}/;
  var match, res = [];
  var orig = str;

  while (match = re.exec(str)) {
    str = str.replace(match[0], '');
    var name = match[1];
    if (keys.indexOf(name) === -1) {
      res.push(name);
    }
  }

  verb.set('stats.unknownHelpers', res);
  return orig;
}

function addTravisBadge(str, stats) {
  debug('addTravisBadge');

  if (stats && stats.hasTravis && !/badge\(.travis/.test(str)) {
    str = str.split('{%= badge("fury") %}').join('{%= badge("fury") %} {%= badge("travis") %}');
  }
  return str;
}

function fixInstall(str) {
  debug('fixInstall');
  var re = /## Install[\s\n]+{%= include/g;
  str = str.replace(re, '{%= include');
  str = str.split('{%= include("install") %}').join('{%= include("install-npm", {save: true}) %}');
  return str;
}

function installGlobal(str, verb) {
  // TODO: if `preferGlobal` or `bin` are in package.json, add
  // {%= include("install-global") %}
  return str;
}

var authors = [
  '{%= include("authors", {',
  '  authors: [',
  '    {name: \'Jon Schlinkert\', username: \'jonschlinkert\'},',
  '    {name: \'Brian Woodward\', username: \'doowb\'}',
  '  ]',
  '}) %}'
].join('\n');


function fixHelpers(str) {
  str = str.split('{%= jscomments').join('{%= apidocs');
  str = str.split('{%= contrib("jon") %}').join('{%= include("author") %}');
  str = str.split('{%= comments').join('{%= apidocs');
  str = str.split('{%= contrib("contributing") %}').join('{%= include("contributing") %}');
  str = str.split('{%= contrib("author") %}').join('{%= include("author") %}');
  str = str.split('{%= contrib("authors") %}').join(authors);
  return str;
}

function matchHelper(name, args) {
  var str = '{%=\\s*' + name + (args || '([\\s\\S]+?)') + '\\s*%}';
  return new RegExp(str);
}

function fixCopyright(str, year) {
  if (!year) {
    return str;
  }
  var segs = str.split('{%= copyright() %}');
  return segs.join('{%= copyright({year: ' + (year || '2015') + '}) %}');
}

function runningTests(str) {
  var re = /## Run tests\n\n```bash\nnpm test\n```/;
  return str.replace(re, '## Running tests\n{%= include("tests") %}');
}

module.exports = function (str, verb) {
  var stats = verb.get('stats');

  str = addTravisBadge(str, stats);
  str = runningTests(str);
  str = fixInstall(str);
  str = fixHelpers(str);

  unknownHelpers(str, verb);
  return str;
};

'use strict';

var authors = [
  '{%= include("authors", {',
  '  authors: [',
  '    {name: \'Jon Schlinkert\', username: \'jonschlinkert\'},',
  '    {name: \'Brian Woodward\', username: \'doowb\'}',
  '  ]',
  '}) %}'
].join('\n');


function addTravisBadge(str, stats) {
  if (stats && stats.hasTravis && !/badge\(.travis/.test(str)) {
    str = str.split('{%= badge("fury") %}').join('{%= badge("fury") %} {%= badge("travis") %}');
  }
  return str;
}

function fixInstall(str) {
  var re = /## Install[\s\n]+{%= include/g;
  str = str.replace(re, '{%= include');
  str = str.split('{%= include("install") %}').join('{%= include("install-npm", {save: true}) %}');
  return str;
}

function fixHelpers(str) {
  str = str.split('{%= jscomments').join('{%= apidocs');
  str = str.split('{%= contrib("jon") %}').join('{%= include("author") %}');
  str = str.split('{%= comments').join('{%= apidocs');
  str = str.split('{%= contrib("contributing") %}').join('{%= include("contributing") %}');
  str = str.split('{%= contrib("author") %}').join('{%= include("author") %}');
  str = str.split('{%= contrib("authors") %}').join(authors);
  return str;
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

module.exports = function (str, stats) {
  str = addTravisBadge(str, stats);
  str = runningTests(str);
  str = fixInstall(str);
  str = fixHelpers(str);
  return str;
};

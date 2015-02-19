'use strict';

function fixInstall(str) {
  var re = new RegExp('## Install\n{%= include');
  return str.replace(re, '{%= include');
}

function fixHelpers(str) {
  var re = new RegExp('{%= jscomments\\(', 'g');
  return str.replace(re, '{%= apidocs(');
}

function fixCopyright(str, year) {
  var re = new RegExp('{%= copyright\\(\\) %}', 'g');
  return str.replace(re, '{%= copyright({year: ' + (year || '2015') + '}) %}');
}

module.exports = function (str, year) {
  str = fixCopyright(str, year);
  str = fixInstall(str);
  str = fixHelpers(str);
  return str;
};

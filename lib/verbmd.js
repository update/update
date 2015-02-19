'use strict';

function fixInstall(str) {
  var re = /## Install[\s\n]+{%= include/g;
  str = str.replace(re, '{%= include');
  str = str.split('{%= include("install") %}').join('{%= include("install-npm", {save: true}) %}');
  return str;
}

function fixHelpers(str) {
  str = str.split('{%= jscomments').join('{%= apidocs');
  str = str.split('{%= comments').join('{%= apidocs');
  return str;
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

'use strict';

exports.toString = function toString(file) {
  return file && file.contents && file.contents.toString();
};

exports.contains = function contains(file, name) {
  return file.path.indexOf(name) !== -1;
};
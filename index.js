/**
 * update
 * https://github.com/jonschlinkert/update
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


/**
 * @param  {Object} obj The object to update
 * @return {Object}     The updated object
 */
module.exports = function(obj) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (src) {
    Object.getOwnPropertyNames(src).forEach(function (propName) {
      Object.defineProperty(obj, propName,
        Object.getOwnPropertyDescriptor(src, propName));
    });
  });
  return obj;
};
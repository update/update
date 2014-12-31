/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

var extend = require('extend-shallow');
var year = +require('year')();

module.exports = function update(str, options) {
  var opts = extend({to: 2015}, options);
  var re = new RegExp('(Copyright[^\\d]*)(20\\d{2})([^\\n]+)', 'i');
  var match = re.exec(str);
  if (match) {
    var pre = opts.pre || match[1];
    var from = opts.from || match[2];
    var post = opts.post || match[3];
    console.log('    old:', pre + from + post);
    var updated = pre + from + '-' + opts.to + post;
    console.log('updated:', updated);
    str = str.replace(match[0], updated);
  }
  return str;
};

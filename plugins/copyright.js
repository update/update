/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var merge = require('merge-deep');
var sortObj = require('sort-object');
var parseCopyright = require('parse-copyright');
var copyright = require('update-copyright');
var license = require('update-license');
var banner = require('update-banner');
// var pkg = require('update-pkg');


module.exports = function copyright(options) {
  var verb = this;

  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var parsed = parseCopyright(file.contents.toString());
    var data = {};

    if (parsed && parsed[0]) {
      data.copyright = parsed[0].latest;
    }

    verb.data(data);
    extend(file.data, data);

    console.log('copyright data added to the context.');
    this.push(file);
    cb();
  });
};


//   exports.getCopyright = function (filename) {
//     var indexjs = path.resolve(process.cwd(), filename);
//     if (fs.existsSync(indexjs)) {
//       verb.data(indexjs, function (fp) {
//         var str = fs.readFileSync(fp, 'utf8');
//         var parsed = parseCopyright(str);
//         var res = {};
//         if (parsed && parsed[0]) {
//           res.copyright = parsed[0].latest;
//         }
//         console.log('copyright updated');
//         return res;
//       });
//     }
//   };
//   return exports;
// };

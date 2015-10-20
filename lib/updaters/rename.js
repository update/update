
var fs = require('fs');
var del = require('delete');
var async = require('async');
var green = require('ansi-green');
var success = require('success-symbol');
var copyright = require('update-copyright');
var writeFile = require('write');
var pkg = require('load-pkg')();
var cwd = require('cwd');

function renameFiles(files, cb) {
  async.eachSeries(Object.keys(files), function (key, next) {
    fs.rename(key, files[key], next);
  }, cb);
}

var files = {
  'LICENSE-MIT': 'LICENSE',
  '.verbrc.md': '.verb.md',
  'README.md': 'readme.md'
};

// renameFiles(files, function(err) {
//   if (err) {
//     if (err.code !== 'ENOENT') {
//       console.error(err);
//     }
//     return;
//   }
//   var keys = Object.keys(files);
//   var len = keys.length;
//   console.log(green(success), ' renamed ' + len, 'files');
// });

var str = fs.readFileSync('LICENSE', 'utf8');
var updated = copyright(str, pkg);

console.log(updated)

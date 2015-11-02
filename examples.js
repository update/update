'use strict';

var path = require('path');
var del = require('rimraf');
var through = require('through2');
var update = require('./');
var app = update();

// app.config.get = function () {

// };
// console.log(app)


// app.config({
//   plugins: function (obj) {
//     for (var key in obj) {
//       var name = path.basename(key, path.extname(key));
//       var fn = require(path.resolve(key));
//       app.plugin(name, obj[key], fn);
//     }
//   }
// });


// app.config('plugins', function (obj) {
//   for (var key in obj) {
//     var name = path.basename(key, path.extname(key));
//     var fn = require(path.resolve(key));
//     app.plugin(name, obj[key], fn);
//   }
// });

// app.config.process();

// app.plugin('a', require('./lib/pipeline/a')());
// app.plugin('b', require('./lib/pipeline/b'));
// app.plugin('c', require('./lib/pipeline/c')());
// app.plugin(/foo/, require('./lib/pipeline/d')());


// app.on('error', function(err) {
//   console.log('Error in plugin:', err.plugin, err.message)
// });

// app.task('default', function (cb) {
//   app.src('LICENSE')
//     .pipe(through.obj(function (file, enc, next) {
//       if (file.isNull()) return next();
//       next(null, file);
//     }))
//     .pipe(app.pipeline())
//     .pipe(app.dest('actual'))
//     .on('finish', cb);
// });

// app.build('default', function(err) {
//   if (err) return console.log(err);
// });

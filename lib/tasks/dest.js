'use strict';


module.exports = function(app, base, env) {
  var through = require('through2');
  var exhaust = require('stream-exhaust');
  var plugins = base.get('argv.plugins');

  function handle(stage) {
    return through.obj(function (file, enc, next) {
      if (file.isNull()) return next();
      app.handle(stage, file, next);
    });
  }

  return function (cb) {
    app.toStream('files')
      .on('error', cb)
      .pipe(handle('onStream'))
      .pipe(app.pipeline(plugins))
      .pipe(handle('preWrite'))
      .pipe(app.dest('.'))
      .pipe(exhaust(handle('postWrite')))
      .on('error', cb)
      .on('end', cb);
  };
};

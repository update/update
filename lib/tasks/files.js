'use strict';

var path = require('path');

module.exports = function(app, env) {
  app.create('files', {
    renameKey: function (key) {
      return path.basename(key);
    }
  });

  var glob = env.base.get('argv.files');
  if (!glob) {
    glob = ['*', 'lib/*', 'bin/*'];
  }

  return function (cb) {
    app.files(glob, {dot: true});
    cb();
  }
};

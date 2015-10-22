'use strict';

module.exports = function(app, env) {
  app.create('files');

  var glob = env.base.get('argv.files') || '*';
  return function (cb) {
    app.files(glob, {dot: true});
    console.log('glob:', app.views.files);
    cb();
  }
};

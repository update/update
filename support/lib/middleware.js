'use strict';

var isValid = require('is-valid-app');
var path = require('path');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, 'update-support-middleware')) return;
    app.cache.views = {docs: []};

    app.onLoad(/\.md$/, function(view, next) {
      view.data.related = view.data.related || {};
      view.data.layout = 'default';
      if (view.data.toc === true) {
        view.data.toc = {render: true};
      }
      if (view.stem.indexOf('docs.') === 0) {
        app.cache.views.docs.push(view);
      }
      next();
    });

    app.preWrite(/\.md$/, function(file, next) {
      var segs = file.stem.split('.').filter(Boolean);
      if (segs[0] === 'docs') {
        segs.shift();
        file.stem = segs[0];
      }
      if (segs.length > 1) {
        file.path = path.resolve(file.base, segs.join('/') + file.extname);
      }
      next();
    });
  };
};

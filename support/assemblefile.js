'use strict';

var path = require('path');
var helpers = require('template-helpers');
var generators = require('base-generators');
var common = require('./lib/common');
var paths = require('./lib/paths');

module.exports = function(app) {
  app.helpers(helpers());
  app.use(generators());
  app.use(common());
  // app.register('verb', require('./verbfile'));

  // app.task('verb', function(cb) {
  //   app.generate('verb', cb);
  // });

  // app.task('default', ['verb'], function() {
  //   app.layouts(paths.tmpl('layouts/*.hbs'));
  //   app.includes(paths.tmpl('includes/*.hbs'));
  //   app.pages(paths.docs('**/*.md'));
  //   return app.toStream('pages')
  //     .pipe(app.renderFile())
  //     // .pipe(app.dest(paths.site()));
  // });

  app.onLoad(/\.md$/, function(view, next) {
    var data = '---\ntitle: ';
    data += view.stem.charAt(0).toUpperCase() + view.stem.slice(1);
    data += '\n';
    data += 'layout: default';
    data += 'related:';
    data += '  docs: []';
    data += '---\n\n';
    view.content = data + view.content;
    next();
  });

  app.task('default', function() {
    app.pages('docs/**/*.md');
    return app.toStream('pages')
      // .pipe(app.renderFile())
      .pipe(app.dest('docs'));
  });
};

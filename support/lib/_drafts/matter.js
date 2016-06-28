
  // app.onLoad(/\.md$/, function(view, next) {
  //   if (/^#/.test(view.content)) {
  //     view.content = view.content.replace(/^#[^\n]+/, '');
  //   }
  //   var data = '---\ntitle: ';
  //   var title = view.stem;
  //   var segs = title.split('.');
  //   if (segs.length > 1) {
  //     title = segs[1];
  //   }
  //   title = title.split('-').join(' ');
  //   title = title.charAt(0).toUpperCase() + title.slice(1);
  //   data += title;
  //   data += '\n';
  //   data += 'layout: default\n';
  //   data += 'related:\n';
  //   data += '  doc: []\n';
  //   data += '---\n\n';
  //   view.content = data + view.content;
  //   next();
  // });

  // app.task('default', function() {
  //   app.pages('docs/**/*.md');
  //   return app.toStream('pages')
  //     // .pipe(app.renderFile())
  //     .pipe(app.dest('docs'));
  // });

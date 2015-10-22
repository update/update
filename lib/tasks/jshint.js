
module.exports = function(app) {
  return function (cb) {
    app.src('.jshintrc')
      .pipe(app.dest('blah'))
      .on('end', cb);
  }
};

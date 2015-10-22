'use strict';

module.exports = function(app, env) {
  return function () {
    return app.toStream('files')
      .pipe(app.dest('.'));
  };
};

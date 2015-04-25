
var update = require('./');
var del = require('del');

update.task('default', function () {
  update.src('*.*')
    // .pipe(update.dest('./actual'))
    // .on('end', function (cb) {
    //   process.nextTick(function () {
    //     del('actual', cb);
    //   })
    // });
});

update.run();

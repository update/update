var update = require('./');
var del = require('del');

update.task('default', function (cb) {
  console.log('deleting...');
  del('foooo', cb);
});

update.run();

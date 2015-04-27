var update = require('./');
var del = require('del');

update.task('default', function () {
  del('actual', cb);
});

update.run();

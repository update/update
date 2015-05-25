var update = require('./');
var del = require('del');

update.task('default', function () {
  console.log('default...');
});

update.task('one', function () {
  console.log('one...');
});

update.task('two', function () {
  console.log('two...');
});

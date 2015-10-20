
var fs = require('fs');
var del = require('delete');
var writeFile = require('write');
var green = require('ansi-green');
var success = require('success-symbol');
var cwd = require('cwd');

function update(filepath, cb) {
  var banner = 'The MIT License (MIT)\n\n';
  var fp = cwd(filepath);

  fs.readFile(fp, 'utf8', function (err, str) {
    if (err) return cb(err);

    if (!/^The MIT License \(MIT\)/i.test(str)) {
      str = banner + str;
    }

    del(filepath, function (err) {
      if (err) return cb(err);

      writeFile('LICENSE', str, function (err) {
        if (err) return cb(err);

        return cb(null, 'updated');
      });
    });
  });
}

update('LICENSE', function (err, res) {
  if (err) {
    return console.error(err);
  }
  var msg = ' LICENSE is already up to date.';
  if (res === 'updated') {
    msg = ' updated LICENSE';
  }
  console.log(green(success), msg);
});

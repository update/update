
function toStream(options, cb) {
  return through.obj(function (file, enc, cb) {
    var str = file.contents.toString();

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
}

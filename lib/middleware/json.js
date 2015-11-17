'use strict';

module.exports = function(app, base, env) {
  base.onLoad(/\.js(on|hintrc)$/, function(file, next) {
    if (file.content) file.json = JSON.parse(file.content);
    next();
  });

  base.preWrite(/\.js(on|hintrc)$/, function(file, next) {
    if (file.json) file.content = JSON.stringify(file.json, null, 2);
    next();
  });
};

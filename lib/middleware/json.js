'use strict';

var sortArrays = require('sort-object-arrays');

module.exports = function(app, base, env) {
  base.onLoad(/\.js(on|hintrc)$/, function(file, next) {
    file.json = JSON.parse(file.content);
    next();
  });

  base.preWrite(/\.js(on|hintrc)$/, function(file, next) {
    file.json = sortArrays(file.json);
    file.content = JSON.stringify(file.json, null, 2);
    file.content += '\n';
    next();
  });
};

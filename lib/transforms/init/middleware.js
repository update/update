'use strict';

var chalk = require('chalk');
var mu = require('middleware-utils');
var tu = require('template-utils').utils;
var middleware = require('../../middleware');
var err = mu.error, regex;

/**
 * Initialize default middleware
 */

module.exports = function(app) {
  // use extensions from engines to create route regex
  if (typeof regex === 'undefined') {
    regex = tu.extensionRe(Object.keys(app.engines));
  }

  app.onLoad(regex, mu.series([
      middleware.matter(app),
    ]))
    .onLoad(/./, mu.series([
      middleware.data,
      middleware.src,
      middleware.ext,
    ]));
};

function debugFile(method, output) {
  return function(file, next) {
    if (!output) return next();
    console.log(chalk.yellow('//', method + ' ----------------'));
    console.log(chalk.bold('file.path:'), file.path);
    console.log(chalk.cyan('file.data:'), file.data);
    console.log(chalk.gray('file.opts:'), file.options);
    console.log(chalk.yellow('// end -----------------------'));
    console.log();
    next();
  };
}

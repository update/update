'use strict';

var utils = require('../../utils/');

/**
 * Initialize default middleware
 */

module.exports = function middleware_(app) {
  app.onLoad(/\.js$/, utils.parallel([
    require('../../middleware/copyright')(app),
    require('../../middleware/todos')(app),
  ]), error('.onLoad (js):'));

  app.onLoad(/\.md$/, utils.series([
    require('../../middleware/conflict')(app),
    require('../../middleware/copyright')(app),
    require('../../middleware/props'),
    require('../../middleware/cwd')(app),
    require('../../middleware/engine'),
    require('../../middleware/src'),
    require('../../middleware/dest'),
    require('../../middleware/ext'),
    require('../../middleware/lint')(app),
    require('template-toc')(app),
    utils.escape,
  ]), error('.onLoad (md):'));

  app.preRender(/\.md$/, utils.parallel([
    require('../../middleware/lint')(app),
    require('../../middleware/multi-toc'),
    require('../../middleware/readme'),
  ]), error('.preRender (md):'));

  app.postRender(/\.md$/, utils.parallel([
    utils.unescape,
    require('../../middleware/lint-after')(app),
    require('../../middleware/diff')(app)
  ]), error('.postRender:'));
};

function error(method) {
  return function (err, file, next) {
    if (err) console.log(method, err);
    next();
  };
}

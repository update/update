'use strict';

var utils = require('./utils');

module.exports = function(options) {
  return function(app) {
    var res = utils.config(app)
      .map('store', store(app.store))
      .map('option')
      .map('set')
      .map('del')
      .map('get', function(key) {
        console.log(app.get(key));
      });

    // app.on('argv', function(argv) {
    //   res.process(utils.expand(argv));
    // });
  };
}

function store(app) {
  var res = utils.config(app)
    .map('set')
    .map('del')
    .map('has', function(key) {
      console.log(!!app.get(key));
    })
    .map('get', function(key) {
      console.log(app.get(key));
    })

  return function(args) {
    // res.process(utils.expand(args));
  };
}

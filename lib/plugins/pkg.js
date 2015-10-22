
var Engine = require('engine');
var typeOf = require('kind-of');
var pkg = require('load-pkg')();
var extend = require('extend-shallow');
var writeJson = require('write-json');
var schema = require('./defaults');

function update(config, options) {
  var engine = new Engine(options);

  for (var key in schema) {
    if (schema.hasOwnProperty(key)) {
      var val = schema[key];

      if (typeOf(config[key]) !== val.type) {
        var value = config[key];

        if (typeof value === 'undefined' && val.add) {
          if (typeof val.value === 'undefined') {
            throw new Error('expected "value" to not be undefined for: ' + key);
          }
          config[key] = val.value;

        } else if (val.value) {
          config[key] = val.value;

        } else if (val.template) {
          var ctx = extend({}, config);
          val.context(config, ctx);
          config[key] = engine.render(val.template, ctx);
        }
      } else if (typeof val.fn === 'function') {
        config[key] = val.fn(config[key], config);
      }
    }
  }
  return config;
}

var config = update(pkg);
console.log(config)

writeJson('package.json', config, function (err) {
  if (err) return console.error(err);
  console.log('updated package.json');
});

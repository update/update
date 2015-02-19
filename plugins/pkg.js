'use strict';

var path = require('path');
var diff = require('arr-diff');
var clone = require('clone-deep');
var through = require('through2');
var sortObj = require('sort-object');
var update = require('update-package');
var logger = require('../lib/logging');

module.exports = function pkgPlugin(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer() || path.basename(file.path) !== 'package.json') {
        this.push(file);
        return cb();
      }

      try {
        verb.cache.data = verb.cache.data || {};
        var licenses = verb.cache.data.licenses;
        var license = verb.cache.data.license;

        if (Array.isArray(licenses)) {
          licenses = [fixLicense(licenses[0])];
        } else if (typeof license === 'object') {
          licenses = [fixLicense(license)];
        }

        var log = logger({nocompare: true});
        var str = file.contents.toString();
        var obj = JSON.parse(str);

        // run updates on package.json fields
        var pkg = update(clone(obj));

        var defaults = [
          'name',
          'description',
          'version',
          'homepage',
          'author',
          'maintainers',
          'repository',
          'bugs',
          'license',
          'licenses',
          'files',
          'main',
          'private',
          'preferGlobal',
          'bin',
          'engines',
          'scripts',
          'dependencies',
          'devDependencies',
          'keywords'
        ];

        var keys = diff(Object.keys(pkg), defaults);
        var res = sortObj(pkg, defaults.concat(keys));
        res.licenses = licenses;
        delete res.license;

        if (res.scripts && res.scripts.test && /mocha -r/i.test(res.scripts.test)) {
          res.scripts.test = 'mocha';
        }

        file.contents = new Buffer(JSON.stringify(res, null, 2));
        log.success(null, 'updated properties in', file.relative);
      } catch (err) {
        console.log('plugin:pkg', err);
      }

      this.push(file);
      cb();
    });
  };
};

function fixLicense(license) {
  if (license && license.url && license.url.indexOf('LICENSE-MIT') !== -1) {
    license.url = license.url.split('LICENSE-MIT').join('LICENSE');
  }
  return license;
}

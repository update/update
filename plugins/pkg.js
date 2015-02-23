'use strict';

var path = require('path');
var diff = require('arr-diff');
var clone = require('clone-deep');
var typeOf = require('kind-of');
var unique = require('array-unique');
var through = require('through2');
var sortObj = require('sort-object');
var update = require('update-package');
var logger = require('../lib/logging');
var utils = require('../lib/utils');
var pkgUtil = require('../lib/pkg');

module.exports = function pkgPlugin(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer() || path.basename(file.path) !== 'package.json') {
        this.push(file);
        return cb();
      }

      try {
        var log = logger({nocompare: true});
        var str = file.contents.toString();
        var obj = JSON.parse(str);

        // run updates on package.json fields
        var pkg = update(obj);

        // populate the `files` property
        pkg.files = pkgUtil.files.toFiles(file.base, pkg.files);

        // populate the `browser` property
        // var browser = pkgUtil.files.toFiles(file.base, ['browser.js']);
        // if (browser.length || pkg.browser && pkg.browser.length) {
        //   pkg.browser = unique(browser, pkg.browser);
        // }

        var repo = pkg && pkg.repository && typeof pkg.repository === 'object'
          ? pkg.repository.url
          : pkg.repository;

        // make repo a string.
        if (repo) {
          pkg.repository = pkgUtil.repo.toString(repo);
        }

        pkg = pkgUtil.devDependencies.removeVerb(pkg);

        if (!verb.get('data.hasShould')) {
          pkg = pkgUtil.devDependencies.removeShould(pkg);
        }

        pkg.license = 'MIT';
        delete pkg.licenses;

        // order of preference. keywords last to keep most keys
        // on the same screen when reviewing properties
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
          'browser',
          'main',
          'private',
          'preferGlobal',
          'bin',
          'engineStrict',
          'engines',
          'scripts',
          'dependencies',
          'devDependencies',
          'keywords'
        ];

        var keys = diff(Object.keys(pkg), defaults);
        var res = sortObj(pkg, defaults.concat(keys));

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
  if (typeof license === 'string') {
    return license;
  }

  if (typeOf(license) === 'object' && license.url && license.url.indexOf('LICENSE-MIT') !== -1) {
    license.url = license.url.split('LICENSE-MIT').join('LICENSE');
  }

  return license;
}

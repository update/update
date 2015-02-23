'use strict';

var path = require('path');
var clone = require('clone-deep');
var typeOf = require('kind-of');
var unique = require('array-unique');
var through = require('through2');
var update = require('update-package');
var logger = require('../lib/logging');
var utils = require('../lib/utils');
var helpers = require('./helpers/');

/**
 * virtually everything in this file is a temporary
 * hack until I get update-package straightened out.
 */

module.exports = function(verb) {
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
        pkg.files = helpers.files.toFiles(file.base, pkg.files);

        // populate the `browser` property
        // var browser = helpers.files.toFiles(file.base, ['browser.js']);
        // if (browser.length || pkg.browser && pkg.browser.length) {
        //   pkg.browser = unique(browser, pkg.browser);
        // }

        var repo = pkg && pkg.repository && typeof pkg.repository === 'object'
          ? pkg.repository.url
          : pkg.repository;

        // make repo a string.
        if (repo) {
          pkg.repository = helpers.repo.toString(repo);
        }

        pkg = helpers.devDependencies.removeVerb(pkg);

        if (!verb.get('data.hasShould')) {
          pkg = helpers.devDependencies.removeShould(pkg);
        }

        pkg.license = 'MIT';
        delete pkg.licenses;

        pkg = helpers.scripts.fixMocha(pkg);

        file.contents = new Buffer(JSON.stringify(pkg, null, 2));
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

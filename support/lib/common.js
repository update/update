'use strict';

var isValid = require('is-valid-app');
var path = require('path');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, 'update-support-common')) return;
    app.use(require('generate-collections'));
    app.use(require('generate-defaults'));
    app.use(require('verb-toc'));
    if (!app.docs) app.create('docs');
    app.option('renameKey', function(key, file) {
      return file ? file.basename : path.basename(key);
    });

    app.helper('links', function(arr) {
      arr = arr ? (Array.isArray(arr) ? arr : [arr]) : [];
      var links = arr.map(function(link) {
        return createLink(link);
      });
      return links.join('\n');
    });
  };
};

function createLink(link) {
  var filepath = name;
  var name = link;
  var anchor = '';
  var segs = link.split('#');
  if (segs.length > 1) {
    name = segs.shift();
    anchor = '#' + segs.pop();
  }
  var filename = name;
  if (!/\.md$/.test(filename) && !/#/.test(filename)) {
    filename += '.md';
  }
  return `- [${name}](${filename}${anchor})`;
}

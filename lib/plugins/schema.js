'use strict';

var fs = require('fs');
var glob = require('matched');
var get = require('get-value');
var set = require('set-value');
var parseAuthor = require('parse-author');
var parseUrl = require('parse-github-url');
var url = require('url');

function isGithubUrl(str) {
  var obj = url.parse(str);
  var hosts = ['github.com', 'github.io', 'gist.github.com'];
  return hosts.indexOf(obj.host) > -1;
}

module.exports = {
  name: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  version: {
    type: 'string'
  },
  homepage: {
    type: 'string'
  },
  author: {
    type: 'string',
    value: 'Jon Schlinkert (https://github.com/jonschlinkert)',
    template: '<%= author.name %> (<%= author.url %>)'
  },
  repository: {
    type: 'string',
    template: '<%= author.username %>/<%= name %>',
    context: function (config, ctx) {
      var author = get(config, 'author');
      if (typeof author === 'undefined') {
        return config;
      }

      if (typeof author === 'string') {
        author = parseAuthor(author);
        set(ctx, 'author', author);
      }

      if (typeof author.username === 'undefined') {
        if (!author.url || !isGithubUrl(author.url)) {
          return config;
        }
        var parsed = parseUrl(author.url);
        var username = parsed.user;
        set(ctx, 'author.username', username);
      }
      return config;
    }
  },
  bugs: {
    type: 'object',
    value: {
      url: {
        type: 'string',
        template: 'https://github.com/<%= author.username %>/<%= name %>/issues',
      }
    }
  },
  license: {
    type: 'string',
    value: 'MIT'
  },
  files: {
    type: 'array',
    fn: function (arr, config) {
      var files = glob.sync('**/*.js', {
        ignore: ['node_modules/**']
      });

      var len = files.length, i = -1;
      var res = [];
      while (++i < len) {
        var name = files[i];
        if (/test(\/.*)?\.js$/.test(name)) {
          continue;
        }
        res.push(name);
      }
      return res;
    }
  },
  main: {
    type: 'string'
  },
  engines: {
    type: 'object'
  },
  scripts: {
    type: 'object'
  },
  dependencies: {
    type: 'object'
  },
  devDependencies: {
    type: 'object'
  },
  keywords: {
    type: 'array'
  },
  verb: {
    type: 'object',
    add: true,
    value: {
      related: {
        description: '',
        list: []
      }
    }
  }
};

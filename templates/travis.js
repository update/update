module.exports = [
  'sudo: false',
  'language: node_js',
  'node_js:',
  '  - "0.10"',
  '  - "0.12"',
  '  - "iojs"',
  'git:',
  '  depth: 10'
].join('\n');

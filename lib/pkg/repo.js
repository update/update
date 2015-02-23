


exports.toString = function(url) {
  return url.replace(/\w+:\/\/github.com\/(.*?)(?:\.git)?$/, '$1');
};

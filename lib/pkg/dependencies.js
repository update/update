


exports.removeVerb = function(pkg) {
  if (pkg && pkg.dependencies && pkg.dependencies['verb-tag-jscomments']) {
    delete pkg['verb-tag-jscomments'];
    delete pkg.verb;
  }
  return pkg;
};




exports.removeVerb = function(pkg) {
  if (pkg && pkg.devDependencies && pkg.devDependencies['verb-tag-jscomments']) {
    delete pkg.devDependencies['verb-tag-jscomments'];
    delete pkg.devDependencies.verb;
  }
  return pkg;
};

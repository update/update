
var fs = require('fs');
var copyright = require('update-copyright');

var str = fs.readFileSync('LICENSE', 'utf8');
var updated = copyright(str, pkg);

console.log(updated)

# update [![NPM version](https://badge.fury.io/js/update.png)](http://badge.fury.io/js/update)

> Update the properties of an object with the properties of other objects

## Quickstart

```bash
npm i update --save
```

```js
var pkg = require('package.json');
var bower = require('bower.json');

console.log(update(bower, pkg));
```

## Run the tests


```bash
npm i mocha -g
```

then run:

```bash
mocha
```


## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github/jonschlinkert)
+ [twitter/jonschlinkert](https://twitter/jonschlinkert)


## License
Copyright (c) 2014 Jon Schlinkert
Licensed under the [MIT license](LICENSE-MIT).

---
title: Notes
related:
  doc: []
---

Visit the [getting started guide][getting-started] to learn more.

Not all generators are created for rendering templates and writing files to the file system. Some generators are created to handle a specific part of the build workflow. For example, [generate-dest][] does one specific thing: when `gen dest` is run in the command line, it will prompt you for the destination directory to use for any generated files. So you can run `gen dest foo` to set the destination directory for files written by `generator-foo`. You can run a generator more than once in the same command, so it's also possible to do: `gen dest foo dest bar`, if both `foo` and `bar` require different destinations.

Generators can be stacked, chained, and nested, making it possible and easy to

build-system features

Powered by some of the same libraries used in [gulp][] and [assemble][], Generate was built from the ground up to kick ass at generating projects.

maintain a separation of concerns between configuration and application logic.

use of [generators](#generators) and [tasks](#tasks)

## tldr

Install `update` globally with the following command:

```js
$ npm install --global update
```

Update is installed globally and run with the `update` command.

- download
- git commit!
- run `update`

```js
var updater = require('{%= name %}');
```

**Example**

This example shows two updaters working together seamlessly.

![Example of how to update a gulpfile.js](demo.gif)

**Want to know more?**

You can use update from the command line, or as a node.js library as a part of your own application.

- Jump to [feature highlights](#feature-highlights)
- Visit the [getting started guide][getting-started]

Continue on, and start updating!

Using a combination of through the use of [updaters]() and [tasks]().  intuitive CLI, and a powerful and expressive API, Update is easy to learn, and enjoyable to use.
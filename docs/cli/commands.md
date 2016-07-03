# Command line flags

Supported command line flags.

## --run

By default, when an `updatefile.js` exists in the current working directory, the `update` command will only run explicitly specified tasks or, if no tasks are explicitly defined, the `default` task in `updatefile.js`.

The `--run` flag forces `update` to run stored tasks and the `default` task or explicitly specified tasks in `updatefile.js`. Stored tasks are executed first, in the order defined, then the `default` task or explicitly defined tasks.

**Default**: `undefined`

**Example**

```sh
$ update --run
```

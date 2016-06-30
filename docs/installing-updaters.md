# Installing updaters

Updaters are responsible for all of the "updating" that happens in update. You can find [updaters to install](#updaters to install) on npm, or create your own.

If you author and publish a updater, please name your updater using the pattern `updater-foo`, where `foo` is the `alias` to be passed to Update's CLI for executing your updater (example: `update foo` would run `updater-foo`).

_(Before proceding, please keep in mind that update's job is to make changes to files that are often neglected. You will get used to this quickly, but to prevent surprises always make sure your work is committed before running `update`)_

Let's install an updater so you can see how this works.

```sh
$ npm install --global updater-license
```

_(The `license` updater will update the copyright statement your `LICENSE` or `LICENSE-MIT` file. If you don't use MIT, that's okay. This is just an example intended to give you the gist of running update. Just be sure to `git commit` first so you can revert any changes afterwards.)_

If `updater-license` installed successfully, you should now be able to run it with the following command:

```sh
$ update license
```

## Related

**Docs**

* [installing-the-cli](installing-the-cli.md)

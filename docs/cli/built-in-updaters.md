# Built in updaters

Update only has a few built-in [updaters](docs/updaters.md) (these might be externalized at some point):

* [init](#init): Choose the updaters to run by default each time `update` is run from the command line
* [list](#list): List all globally and locally installed updaters
* [show](#show): show the list of updaters that will run on the current project when the `update` command is given
* [new](#new): create a new `updatefile.js` in the current working directory
* [help](#help): show a help menu with all available commands

## Usage

### init

Prompts you to choose one or more updaters to run by default each time `update` is run from the command line:

```sh
$ update init
```

### list

List all globally and locally installed updaters:

```sh
$ update list
```

### show

Show the list of updaters that will run on the current project when the `update` command is given:

```sh
$ update show
```

### new

Create a new `updatefile.js` in the current working directory:

```sh
$ update new
```

### help

Display a help menu with all available commands:

```sh
$ update help
```

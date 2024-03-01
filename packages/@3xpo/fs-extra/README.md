<!--
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
-->

<div align="center">

# Mirror

This is a Github mirror of [this codeberg repo](https://codeberg.org/Expo/pkgs).

This repository is read-only. Please use the above repository for forking, contributing and opening issues.

The original README is attached below for reference purposes. It may be outdated and not reflect the current README.

</div>

<div align="center">

[![repo image](https://codeberg.org/Expo/pkgs/raw/branch/senpai/img/fs-extra.png)](https://codeberg.org/Expo/pkgs/src/branch/senpai/packages/@3xpo/fs-extra)

# modern-fs-extra: fs-extra for the 21st century

[![npm Package](https://img.shields.io/npm/v/@3xpo/fs-extra.svg)](https://npm.im/@3xpo/fs-extra)
[![License](https://img.shields.io/npm/l/@3xpo/fs-extra.svg)](https://codeberg.org/Expo/pkgs/src/branch/senpai/LICENSE)
[![build status](https://img.shields.io/github/actions/workflow/status/Exponential-Workload/modern-fs-extra/ci.yml?branch=master)](https://github.com/Exponential-Workload/modern-fs-extra/actions/workflows/ci.yml?query=branch%3Amaster)
[![downloads per month](https://raster.shields.io/npm/dm/@3xpo/fs-extra.png)](https://npm.im/@3xpo/fs-extra)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-custom-blue.svg)](https://codeberg.org/Expo/pkgs/src/branch/senpai/.prettierrc)
[![TypeScript](https://img.shields.io/badge/language-typescript-blue.svg)](https://codeberg.org/Expo/pkgs/src/branch/senpai/.prettierrc)

<!-- idk why the raster downloads fails, however i'll put it here for if i ever get it to render on npm: https://img.shields.io/npm/dm/@3xpo/fs-extra.svg -->

</div>

## Description

`@3xpo/fs-extra` (alongside [upstream fs-extra](https://npmjs.com/package/fs-extra)) adds file system methods that aren't included in the native `fs` module and adds promise support to the `fs` methods. It also uses [`graceful-fs`](https://github.com/isaacs/node-graceful-fs) to prevent `EMFILE` errors. It should be a drop in replacement for `fs`.

## Why the fork?

I got tired of including `@types/fs-extra` in most of my projects. I also wanted a package that can do ESM and CJS without needing to inline the package in my output.

## Installation

    pnpm i @3xpo/fs-extra

## Usage

### CommonJS

`fs-extra` is a drop in-ish replacement for native `fs`. All methods in `fs` are attached to `fs-extra`. All `fs` methods return promises if the callback isn't passed.

This fork modifies the internal callback beahviour a bit, and you may not be able to use a callback everywhere. Unlike the upstream, promises are usually returned even if you do pass a callback.

You don't ever need to include the original `fs` module again:

```ts
import * as fs from 'fs'; // this is no longer necessary
```

you can now do this:

```ts
import fs from '@3xpo/fs-extra';
```

or if you prefer to make it clear that you're using `fs-extra` and not `fs`, you may want
to name your `fs` variable `fse` like so:

```ts
import fse from '@3xpo/fs-extra';
```

you can also keep both, but it's redundant:

```ts
import * as fs from 'fs';
import fse from '@3xpo/fs-extra';
```

### ESM

Unlike our [upstream](https://github.com/jprichardson/node-fs-extra), we package both native ESM and CJS variants - both `require()` and `import` will work just fine

### CJS

As mentioned above, you can simply use:

```ts
const fs = require('@3xpo/fs-extra');
```

## Sync vs Async vs Async/Await

Most methods are async by default. All async methods will return a promise if the callback isn't passed.

Sync methods on the other hand will throw if an error occurs.

Also Async/Await will throw an error if one occurs.

Example:

```ts
import fs from '@3xpo/fs-extra';

// Async with promises:
fs.copy('/tmp/myfile', '/tmp/mynewfile')
  .then(() => console.log('success!'))
  .catch(err => console.error(err));

// Async with callbacks:
fs.copy('/tmp/myfile', '/tmp/mynewfile', err => {
  if (err) return console.error(err);
  console.log('success!');
});

// Sync:
try {
  fs.copySync('/tmp/myfile', '/tmp/mynewfile');
  console.log('success!');
} catch (err) {
  console.error(err);
}

// Async/Await:
async function copyFiles() {
  try {
    await fs.copy('/tmp/myfile', '/tmp/mynewfile');
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}

copyFiles();
```

## Methods

### Async

- [copy](docs/copy.md)
- [emptyDir](docs/emptyDir.md)
- [ensureFile](docs/ensureFile.md)
- [ensureDir](docs/ensureDir.md)
- [ensureLink](docs/ensureLink.md)
- [ensureSymlink](docs/ensureSymlink.md)
- [mkdirp](docs/ensureDir.md)
- [mkdirs](docs/ensureDir.md)
- [move](docs/move.md)
- [outputFile](docs/outputFile.md)
- [outputJson](docs/outputJson.md)
- [pathExists](docs/pathExists.md)
- [readJson](docs/readJson.md)
- [remove](docs/remove.md)
- [writeJson](docs/writeJson.md)

### Sync

- [copySync](docs/copy-sync.md)
- [emptyDirSync](docs/emptyDir-sync.md)
- [ensureFileSync](docs/ensureFile-sync.md)
- [ensureDirSync](docs/ensureDir-sync.md)
- [ensureLinkSync](docs/ensureLink-sync.md)
- [ensureSymlinkSync](docs/ensureSymlink-sync.md)
- [mkdirpSync](docs/ensureDir-sync.md)
- [mkdirsSync](docs/ensureDir-sync.md)
- [moveSync](docs/move-sync.md)
- [outputFileSync](docs/outputFile-sync.md)
- [outputJsonSync](docs/outputJson-sync.md)
- [pathExistsSync](docs/pathExists-sync.md)
- [readJsonSync](docs/readJson-sync.md)
- [removeSync](docs/remove-sync.md)
- [writeJsonSync](docs/writeJson-sync.md)

**NOTE:** You can still use the native Node.js methods. They are promisified and copied over to `fs-extra`. See [notes on `fs.read()`, `fs.write()`, & `fs.writev()`](docs/fs-read-write-writev.md)

### What happened to `walk()` and `walkSync()`?

They were removed from `fs-extra` in v2.0.0. If you need the functionality, `walk` and `walkSync` are available as separate packages, [`klaw`](https://github.com/jprichardson/node-klaw) and [`klaw-sync`](https://github.com/manidlou/node-klaw-sync).

## Third Party

### CLI

~~[fse-cli](https://www.npmjs.com/package/@atao60/fse-cli) allows you to run `fs-extra` from a console or from [npm](https://www.npmjs.com) scripts.~~ fse-cli uses upstream fs-extra. it does not support this fork.

### TypeScript

If you like TypeScript, you can use `fs-extra` with it; we ship types!

### File / Directory Watching

If you want to watch for changes to files or directories, then you should use [chokidar](https://github.com/paulmillr/chokidar).

### Obtain Filesystem (Devices, Partitions) Information

~~[fs-filesystem](https://github.com/arthurintelligence/node-fs-filesystem) allows you to read the state of the filesystem of the host on which it is run. It returns information about both the devices and the partitions (volumes) of the system.~~ fs-filesystem is deprecated.

### Misc.

- ~~[fs-extra-debug](https://github.com/jdxcode/fs-extra-debug) - Send your fs-extra calls to [debug](https://npmjs.org/package/debug).~~
- ~~[mfs](https://github.com/cadorn/mfs) - Monitor your fs-extra calls.~~

Both of these use upstream fs-extra. They don't support this fork out of the box.

If someone's interested in me maintaining a variant of either of these, [open an issue](https://codeberg.org/Expo/pkgs/issues/new)!

## Hacking on fs-extra

Wanna hack on `fs-extra`? Great! Your help is needed! [fs-extra is one of the most depended upon Node.js packages](https://nodei.co/npm/fs-extra.png?downloads=true&downloadRank=true&stars=true) (although this fork [isn't](https://nodei.co/npm/@3xpo/fs-extra.png?downloads=true&downloadRank=true&stars=true), contribs are still nice).

~~This project
uses [JavaScript Standard Style](https://github.com/feross/standard) - if the name or style choices bother you,
you're gonna have to get over it :) If `standard` is good enough for `npm`, it's good enough for `fs-extra`~~ JS Standard Style is overcomplicated & overly strict for no reason; we use a minimal [prettier](https://codeberg.org/Expo/pkgs/src/branch/senpai/.prettierrc) configuration. If you use single quotes & an indent size of 2, and don't code like a maniac, you're basically fine. `camelCase` is preferred for everything except classes; where `PascalCase` is used.

You'll need [pnpm](https://pnpm.io), aswell as the [monorepo](https://codeberg.org/Expo/pkgs) this package is housed in. You shouldn't need much else.

What's needed?

- First, take a look at existing issues, both in [upstream](https://github.com/jprichardson/node-fs-extra) and in the [monorepo](https://codeberg.org/Expo/pkgs/projects/7795). Those are probably going to be where the priority lies.
- More tests for edge cases. Specifically on different platforms. There can never be enough tests.
- Improve test coverage.
- Get new upstream commits into this fork! We split off of upstream at [acf5585](https://github.com/jprichardson/node-fs-extra/commit/acf5585) and are currently in parity with [1d931c8](https://github.com/jprichardson/node-fs-extra/commit/1d931c8); getting anything done since then on the upstream `fs-extra` repository implemented here would be amazing. Sadly, if and when this happens, this is a significant amount of work due to the entire codebase being refactoed in a different language. As such, wherever possible, just re-implement equivalent changes in the fork.
- Provide more features! If you have a use-case for `@3xpo/fs-extra` that it isn't fulfilling, feel free to [open an issue](https://codeberg.org/Expo/pkgs/issues/new)! [Make sure to prefix the issue's title with `fs-extra:`](https://codeberg.org/Expo/pkgs/issues/1) :)

Note: If you make any extremely large changes, **you should definitely file an issue for discussion first** - however if you decide you want the feature in your fork regardless of if it gets merged, feel free to open a PR without a prior issue existing.

### Running the Test Suite

@3xpo/fs-extra contains hundreds of tests.

- `pnpm build`: builds the project
- `pnpm test`: runs the test suite
- you don't need anything else

When running unit tests, when possible, set the environment variable `CROSS_DEVICE_PATH` to the absolute path of an empty directory on another device (like a thumb drive) to enable cross-device move tests.

### Windows

If you run the tests on the Windows and receive a lot of symbolic link `EPERM` permission errors, it's because on Windows you need elevated privilege to create symbolic links. You can add this to your Windows's account by following the instructions here: http://superuser.com/questions/104845/permission-to-make-symbolic-links-in-windows-7

However, the upstream author didn't have much luck doing this.

In regards to shared folders, [the upstream author's suggestions should likely be followed](https://www.npmjs.com/package/fs-extra#windows).

## Naming

I put a lot of thought into the naming of these functions. Inspired by @coolaj86's request, so he deserves much of the credit for raising the issue. See discussion(s) here:

- https://github.com/jprichardson/node-fs-extra/issues/2
- https://github.com/flatiron/utile/issues/11
- https://github.com/ryanmcgrath/wrench-js/issues/29
- https://github.com/substack/node-mkdirp/issues/17

First, I believe that in as many cases as possible, the [Node.js naming schemes](http://nodejs.org/api/fs.html) should be chosen. However, there are problems with the Node.js own naming schemes.

For example, `fs.readFile()` and `fs.readdir()`: the **F** is capitalized in _File_ and the **d** is not capitalized in _dir_. Perhaps a bit pedantic, but they should still be consistent. Also, Node.js has chosen a lot of POSIX naming schemes, which I believe is great. See: `fs.mkdir()`, `fs.rmdir()`, `fs.chown()`, etc.

We have a dilemma though. How do you consistently name methods that perform the following POSIX commands: `cp`, `cp -r`, `mkdir -p`, and `rm -rf`?

My perspective: when in doubt, err on the side of simplicity. A directory is just a hierarchical grouping of directories and files. Consider that for a moment. So when you want to copy it or remove it, in most cases you'll want to copy or remove all of its contents. When you want to create a directory, if the directory that it's suppose to be contained in does not exist, then in most cases you'll want to create that too.

So, if you want to remove a file or a directory regardless of whether it has contents, just call `fs.remove(path)`. If you want to copy a file or a directory whether it has contents, just call `fs.copy(source, destination)`. If you want to create a directory regardless of whether its parent directories exist, just call `fs.mkdirs(path)` or `fs.mkdirp(path)`.

## Credit

`@3xpo/fs-extra` wouldn't be possible without using the modules from the following authors:

- [JP Richardson](https://github.com/jprichardson) (Upstream Repo)
- [Isaac Shlueter](https://github.com/isaacs)
- [Charlie McConnel](https://github.com/avianflu)
- [James Halliday](https://github.com/substack)
- [Andrew Kelley](https://github.com/andrewrk)

## License

Licensed under MIT

Copyright (c) 2024 [Expo](https://codeberg.org/Expo)

Copyright (c) 2011-2017 [JP Richardson](https://github.com/jprichardson)

[1]: http://nodejs.org/docs/latest/api/fs.html
[jsonfile]: https://github.com/jprichardson/node-jsonfile

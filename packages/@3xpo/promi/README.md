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

# @3xpo/promi

Dependency-free, Typesafe library for converting callback-based asynchronous functions into promises in NodeJS.

## Installation

```zsh
pnpm i @3xpo/promi
```

## Usage

The below `brotliCompress`/`brotliDecompress` functions are just used as an example. You can use any function where the last value is a callback (ie `arg1,arg2,arg3,callback`).

### Promi.wrap

Wraps a function. Depends on the first parameter being an error of some kind. Returns a function that returns a promise.

If the callback only gets `err, value`, it will return just `value` - if it, however, gets `(err, ...value)` (where ...value has a length not equal to 1), it will return `value` as an array.

This is the intended way to use Promi. It uses [Promi.wrapPromise](#promiwrappromise) under the hood.

```ts
// import
import {
  brotliCompress as callbackBrotliCompress,
  brotliDecompress as callbackBrotliDecompress,
} from 'zlib';
import Promi from '@3xpo/promi';

// wrap the functions
const brotliCompress = Promi.wrap(brotliDecompress),
  brotliDecompress = Promi.wrap(brotliDecompress);

// in an async function
console.log(await brotliDecompress(await brotliCompress('test'))); // => 'test'
```

### Promi.call

Small wrapper around [Promi.wrap](#promiwrap) to call the function immediately.

```ts
// import
import { brotliCompress, brotliDecompress } from 'zlib';
import Promi from '@3xpo/promi';

// in an async function
console.log(
  await Promi.call(brotliDecompress, await Promi.call(brotliCompress, 'test')),
); // => 'test'
```

### Promi.wrapPromise

Directly wraps a function, returning an array of return values. This will always return a function which returns an array, even if the array only includes one value.

```ts
import {
  brotliCompress as callbackBrotliCompress,
  brotliDecompress as callbackBrotliDecompress,
} from 'zlib';
import Promi from '@3xpo/promi';

const brotliCompress = Promi.wrapPromise(callbackBrotliCompress);
const brotliDecompress = Promi.wrapPromise(callbackBrotliDecompress);
const [err, compressed] = await brotliCompress('test');
if (err) throw err;
const [err2, decompressed] = await brotliDecompress(compressed);
if (err2) throw err2;
console.log(decompressed); // => 'test'
```

### Promi.callPromise

[Promi.call](#promicall), for [Promi.wrapPromise](#promiwrappromise)

```ts
import { brotliCompress, brotliDecompress } from 'zlib';
import Promi from '@3xpo/promi';

const [err, compressed] = await Promi.callPromise(brotliCompress, 'test');
if (err) throw err;
const [err2, decompressed] = await Promi.wrapPromise(
  brotliDecompress,
  compressed,
);
if (err2) throw err2;
console.log(decompressed); // => 'test'
```

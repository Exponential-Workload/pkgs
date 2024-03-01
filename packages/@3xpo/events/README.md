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

# @3xpo/events

[![repo image](https://codeberg.org/Expo/pkgs/raw/branch/senpai/img/events.png)](https://codeberg.org/Expo/pkgs/src/branch/senpai/packages/@3xpo/events)

<!-- links -->

[![documentation](https://img.shields.io/badge/-documentation-brightgreen.svg)](https://gh.expo.moe/events/) [![npm](https://img.shields.io/badge/-npm-red.svg)](https://npm.im/@3xpo/events/) [![codeberg](https://img.shields.io/badge/-codeberg-blue.svg)](https://codeberg.org/Expo/pkgs/src/branch/senpai/packages/@3xpo/events)<br/><!--misc badges-->
[![mit license](https://img.shields.io/badge/license-mit-orange.svg)](https://gh.expo.moe/events/LICENSE.txt) [![mom made pizza](https://img.shields.io/badge/type-safe-blue.svg)](https://typescriptlang.org/) [![mom made pizza](https://img.shields.io/badge/mom%20made-pizza-white.svg)](https://www.youtube.com/watch?v=IO9XlQrEt2Y)<br/><!-- github ci -->
[![build hopefully succeeded](https://img.shields.io/badge/ci%20hopefully%20didn't-die%20again-green.svg)](https://github.com/Exponential-Workload/events/actions/workflows/build.yml)

</div>

## Installation

```bash
pnpm i @3xpo/events
```

## Usage

```ts
import EventEmitter from '@3xpo/events';

const emitter = new EventEmitter<{
  event1: (arg1: string, arg2: number) => void;
  event2: (arg1: string) => void;
}>();

emitter.on('event1', (arg1, arg2) => {
  console.log(arg1, arg2);
});

emitter.emit('event1', 'hello', 123);
```

## Note

The EventEmitter is typesafe. If you want a non-typesafe eventemitter, either pass `<any>` or use NodeEventEmitter.

Note that typesafety is not available in pure JS.

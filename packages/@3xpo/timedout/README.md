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

# @3xpo/timedout

Compromise-less Microlibrary for making promises with timeouts.

## Installation

```zsh
pnpm i @3xpo/timedout;
```

## Usage

```ts
import timedout from '@3xpo/timedout';

const promise = timedout(
  new Promise(resolve => setTimeout(() => resolve('hi!'), 500)),
  1000,
); // will resolve after 500ms, with 'hi!'
const promise2 = timedout(
  new Promise(resolve => setTimeout(() => resolve('hi!'), 10000)),
  1000,
); // will reject after 1s
```

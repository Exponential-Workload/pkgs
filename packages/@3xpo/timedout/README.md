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

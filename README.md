- [@3xpo/devtools](#3xpodevtools)
  - [Tools](#tools)
    - [Libraries](#libraries)
    - [Tools](#tools-1)
  - [Developing](#developing)

[![](https://codeberg.org/Expo/devtools/raw/branch/senpai/img/devtools.png)](#3xpo-devtools)

# @3xpo/devtools

TypeScript libraries & tools for creating things.

## Tools

### Libraries

- [@3xpo](./packages/@3xpo/)
  - [/combgen](./packages/@3xpo/combgen/): A Combination Generation Library.
  - [/resolvablepromise](./packages/@3xpo/resolvablepromise/): Promises which can be resolved from their object.
  - [/locked](./packages/@3xpo/locked/): 21st Century Locking Library.
  - [/promi](./packages/@3xpo/promi/): Promisify callback-based functions with ease.
  - [/conf](./packages/@3xpo/conf/): Microscopic wrapper around a configuration object.

### Tools

- [@3xpo](./packages/@3xpo/)
  - [/es-many](./packages/@3xpo/es-many/): Call esbuild with many input/output variants.

## Developing

Many tools depend on @3xpo/es-many, which needs to be built & installed prior to anything else - this is done in install scripts. You will see prepare scripts build it & it's dependency on `pnpm i`.

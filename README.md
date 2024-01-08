- [@3xpo/devtools](#3xpodevtools)
  - [Tools](#tools)
    - [Libraries](#libraries)
    - [Tools](#tools-1)
  - [Developing](#developing)

[![](https://codeberg.org/Expo/devtools/raw/branch/senpai/social.png)](#3xpo-devtools)

# @3xpo/devtools

TypeScript libraries & tools for creating things.

## Tools

### Libraries

- [@3xpo/combgen](./packages/@3xpo/combgen/): A Combination Generation Library.
- [@3xpo/resolvablepromise](./packages/@3xpo/resolvablepromise/): Promises which can be resolved from their object.
- [@3xpo/locked](./packages/@3xpo/locked/): 21st Century Locking Library.
- [@3xpo/promi](./packages/@3xpo/promi/): Promisify callback-based functions with ease.
- [@3xpo/conf](./packages/@3xpo/conf/): Microscopic wrapper around a configuration object.

### Tools

- [@3xpo/es-many](./packages/@3xpo/es-many/): Call esbuild with many input/output variants.

## Developing

Many tools depend on @3xpo/es-many, which needs to be built & installed prior to anything else - to do this, simply run `pnpm i; nx run @3xpo/es-many:build; pnpm i;` - for convenience, you can run the `pnpm postclone` script which does the same thing. This usually only needs to be done once.

[![](https://codeberg.org/Expo/pkgs/raw/branch/senpai/img/pkgs.png)](#3xpo-pkgs)

# @3xpo/pkgs

TypeScript libraries & tools for creating things.

## Tools

### Libraries

- [querymimedb](./packages/querymimedb/): Queries the system's MIME Database
- [@3xpo](./packages/@3xpo/)
  - [/events](./packages/@3xpo/events/): Type-Safe Node-Styled Events, Anywhere.
  - [/fs-extra](./packages/@3xpo/fs-extra/): Fork of [fs-extra](https://github.com/jprichardson/node-fs-extra) for the 21st century.
  - [/resolvablepromise](./packages/@3xpo/resolvablepromise/): Promises which can be resolved from their object.
  - [/combgen](./packages/@3xpo/combgen/): A Combination Generation Library.
  - [/locked](./packages/@3xpo/locked/): 21st Century Locking Library.
  - [/promi](./packages/@3xpo/promi/): Promisify callback-based functions with ease.
  - [/timedout](./packages/@3xpo/timedout/): Promises with Timeouts
  - [/universalify](./packages/@3xpo/universalify/): Fork of [universalify](https://github.com/RyanZim/universalify) with proper typesafety
  - [/conf](./packages/@3xpo/conf/): Microscopic wrapper around a configuration object.

### Tools

- [@3xpo](./packages/@3xpo/)
  - [/es-many](./packages/@3xpo/es-many/): Call esbuild with many input/output variants.

## Developing

Many tools depend on @3xpo/es-many, which needs to be built & installed prior to anything else - this is done in install scripts. You will see prepare scripts build it & it's dependency on `pnpm i`.

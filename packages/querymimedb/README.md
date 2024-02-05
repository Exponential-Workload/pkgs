# querymimedb

Query the MIME DB on systems that support it.

Essentially equivalent to `file --mime-type`, but faster, as we don't spawn an additional process.

This will fail when:

1. the file does not have any known filetype;
2. the system doesn't have a mime db, or;
3. [`libmagic`](https://archlinux.org/packages/core/x86_64/file/) is not installed.

See JSDocs for more detailed documentation. We recommend falling back to a traditional filepath-based solution, such as [mime-types](https://npm.im/mime-types), when this package errors.

## System Dependencies

We depend on CMake to be installed system-wide to build the node bindings. Additionally, on most systems, a package like `g++` will be required aswell.

If ninja is installed, cmake-js will use it, however you can build without it.

Both at compile and runtime, the `magic` library is required, however to run on systems without it, we won't error if it isn't present at installation time. Instead, you will get a [`ERR_NOT_BUILD_WITH_LIBMAGIC`](https://codeberg.org/Expo/devtools/src/commit/1ffc15a71e218ba5c6cdc71e68de61139c15cb46/packages/querymimedb/src/js-space.ts#L43-L49) (when the compiler couldn't link against it) or [`ERR_NO_LIBMAGIC`](https://codeberg.org/Expo/devtools/src/commit/1ffc15a71e218ba5c6cdc71e68de61139c15cb46/packages/querymimedb/src/js-space.ts#L51-L57) (when it's not loadable at runtime) when calling `query()`. You can programmatically check if you're encounting one of these via the [`QueryException.code` property](https://codeberg.org/Expo/devtools/src/commit/1ffc15a71e218ba5c6cdc71e68de61139c15cb46/packages/querymimedb/src/exceptions.ts#L4).

## Installation

Assuming the above section has been fulfilled, `pnpm i querymimedb`

## Example Usage

### ESM

```ts
import fs from 'fs';
import query from 'querymimedb';
fs.writeFileSync('test.txt', '');
query('./test.txt'); // => inode/x-empty
fs.writeFileSync('test.txt', 'Some Contents');
query('./test.txt'); // => text/plain
```

### CJS

```ts
const fs = require('fs');
const { query } = require('querymimedb');
fs.writeFileSync('test.txt', '');
query('./test.txt'); // => inode/x-empty
fs.writeFileSync('test.txt', 'Some Contents');
query('./test.txt'); // => text/plain
```

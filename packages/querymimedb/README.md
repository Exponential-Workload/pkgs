# querymimedb

Query the MIME DB on systems that support it.

Essentially equivalent to `file --mime-type`, but faster, as we don't spawn an additional process.

This will fail when:
(a) the file does not have any known filetype;
(b) the system doesn't have a mime type

See JSDocs for more info. We recommend falling back to a traditional filepath-based solution, such as [mime-types](https://npm.im/mime-types).

## System Dependencies

We depend on CMake to be installed system-wide to build the node bindings. Additionally, on most systems, a package like `g++` will be required aswell.

If ninja is installed, cmake-js will use it, however you can build without it.

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

# outputFileSync(file, data[, options])

Almost the same as `writeFileSync` (i.e. it overwrites), except that if the parent directory does not exist, it's created. `file` must be a file path (a buffer or a file descriptor is not allowed).

- `file` `<String>`
- `data` `<String> | <Buffer> | <Uint8Array>`
- `options` `<Object> | <String>` (the same as [`fs.writeFileSync()` options](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options))

## Example:

```js
import fs from '@3xpo/fs-extra';

const file = '/tmp/this/path/does/not/exist/file.txt';
fs.outputFileSync(file, 'hello!');

const data = fs.readFileSync(file, 'utf8');
console.log(data); // => hello!
```

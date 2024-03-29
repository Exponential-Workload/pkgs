# moveSync(src, dest[, options])

Moves a file or directory, even across devices.

- `src` `<String>`
- `dest` `<String>` Note: When `src` is a file, `dest` must be a file and when `src` is a directory, `dest` must be a directory.
- `options` `<Object>`
  - `overwrite` `<boolean>`: overwrite existing file or directory, default is `false`.

## Example:

```js
import fs from '@3xpo/fs-extra';

fs.moveSync('/tmp/somefile', '/tmp/does/not/exist/yet/somefile');
```

**Using `overwrite` option**

```js
import fs from '@3xpo/fs-extra';

fs.moveSync('/tmp/somedir', '/tmp/may/already/exist/somedir', {
  overwrite: true,
});
```

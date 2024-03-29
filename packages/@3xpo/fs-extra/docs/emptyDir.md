# emptyDir(dir[, callback])

Ensures that a directory is empty. Deletes directory contents if the directory is not empty. If the directory does not exist, it is created. The directory itself is not deleted.

**Alias:** `emptydir()`

- `dir` `<String>`
- `callback` `<Function>`
  - `err` `<Error>`

## Example:

```js
import fs from '@3xpo/fs-extra';

// assume this directory has a lot of files and folders
// With a callback:
fs.emptyDir('/tmp/some/dir', err => {
  if (err) return console.error(err);
  console.log('success!');
});

// With Promises:
fs.emptyDir('/tmp/some/dir')
  .then(() => {
    console.log('success!');
  })
  .catch(err => {
    console.error(err);
  });

// With async/await:
async function example() {
  try {
    await fs.emptyDir('/tmp/some/dir');
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}

example();
```

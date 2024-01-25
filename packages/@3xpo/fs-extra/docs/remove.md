# remove(path[, callback])

Removes a file or directory. The directory can have contents. If the path does not exist, silently does nothing.

- `path` `<String>`
- `callback` `<Function>`
  - `err` `<Error>`

## Example:

```js
import fs from '@3xpo/fs-extra'

// remove file
// With a callback:
fs.remove('/tmp/myfile').then(() => {
  console.log('success!')
})

fs.remove('/home/jprichardson').then(() => {
  console.log('success!') // I just deleted my entire HOME directory.
})

// With async/await:
const main = (src, dest) => {
  try {
    await fs.remove('/tmp/myfile')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

example()
```

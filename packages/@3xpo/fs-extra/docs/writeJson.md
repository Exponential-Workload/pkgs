# writeJson(file, object[, options][, callback])

Writes an object to a JSON file.

**Alias:** `writeJSON()`

- `file` `<String>`
- `object` `<Object>`
- `options` `<Object>`
  - `spaces` `<Number> | <String>` Number of spaces to indent; or a string to use for indentation (i.e. pass `'\t'` for tab indentation). See [the docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_argument) for more info.
  - `EOL` `<String>` Set EOL character. Default is `\n`.
  - `replacer` [JSON replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter)
  - Also accepts [`fs.writeFile()` options](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
- `callback` `<Function>`
  - `err` `<Error>`

## Example:

```js
import fs from '@3xpo/fs-extra';

// With a callback:
fs.writeJson('./package.json', { name: '@3xpo/fs-extra' }, err => {
  if (err) return console.error(err);
  console.log('success!');
});

// With Promises:
fs.writeJson('./package.json', { name: '@3xpo/fs-extra' })
  .then(() => {
    console.log('success!');
  })
  .catch(err => {
    console.error(err);
  });

// With async/await:
async function example() {
  try {
    await fs.writeJson('./package.json', { name: '@3xpo/fs-extra' });
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}

example();
```

---

**See also:** [`outputJson()`](outputJson.md)

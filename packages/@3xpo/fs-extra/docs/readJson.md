# readJson(file[, options][, callback])

Reads a JSON file and then parses it into an object.

**Alias:** `readJSON()`

- `file` `<String>`
- `options` `<Object>` (the same as [`jsonFile.readFile()` options](https://github.com/jprichardson/node-jsonfile#readfilefilename-options-callback))
- `callback` `<Function>`
  - `err` `<Error>`
  - `obj` `<Object>`

## Example:

```js
import fs from '@3xpo/fs-extra';

// With a callback:
fs.readJson('./package.json', (err, packageObj) => {
  if (err) console.error(err);
  console.log(packageObj.version); // => 0.1.3
});

// With Promises:
fs.readJson('./package.json')
  .then(packageObj => {
    console.log(packageObj.version); // => 0.1.3
  })
  .catch(err => {
    console.error(err);
  });

// With async/await:
async function example() {
  try {
    const packageObj = await fs.readJson('./package.json');
    console.log(packageObj.version); // => 0.1.3
  } catch (err) {
    console.error(err);
  }
}

example();
```

---

`readJson()` can take a `throws` option set to `false` and it won't throw if the JSON is invalid. Example:

```js
import fs from '@3xpo/fs-extra';

const file = '/tmp/some-invalid.json';
const data = '{not valid JSON';
fs.writeFileSync(file, data);

// With a callback:
fs.readJson(file, { throws: false }, (err, obj) => {
  if (err) console.error(err);
  console.log(obj); // => null
});

// With Promises:
fs.readJson(file, { throws: false })
  .then(obj => {
    console.log(obj); // => null
  })
  .catch(err => {
    console.error(err); // Not called
  });

// With async/await:
async function example(f) {
  const obj = await fs.readJson(f, { throws: false });
  console.log(obj); // => null
}

example(file);
```

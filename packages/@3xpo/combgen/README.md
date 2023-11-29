# combgen

Generates combinations.

Example Usage:

```ts
const inputObject = {
  a: [1, 2],
  b: [true, false],
};

const result = generateCombinations(inputObject);

const expectedObj = [
  { a: 1, b: true },
  { a: 1, b: false },
  { a: 2, b: true },
  { a: 2, b: false },
];

if (JSON.stringify(expectedObj) !== JSON.stringify(result))
  throw new Error('mismatch');
```

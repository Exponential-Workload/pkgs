# @3xpo/resolvablepromise

Promises which can be resolved from their object

## Example Usage

```ts
import ResovlablePromise from '@3xpo/resolvablepromise';
const p = new ResolvablePromise();
setTimeout(() => p.resolve('World'), 100);
const p2 = new ResolvablePromise();
setTimeout(() => p.resolve('How are you?'), 200);
(async () => {
  console.log('Hello,');
  console.log(`${await p}!`);
  await p2;
  console.log(p2.value);
})();
```

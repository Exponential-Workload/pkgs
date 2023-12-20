# @3xpo/locked

Locking Library for the 21st Century

## Usage

```ts
import Locked from '@3xpo/locked';

const lock = new Locked();
setTimeout(async () => {
  const unlock = await lock.lock('test');
  await new Promise(rs => setTimeout(rs, 10));
  console.log('3');
  unlock();
  console.log('4');
}, 10);
(async () => {
  const unlock = await lock.lock('test');
  await new Promise(rs => setTimeout(rs, 100));
  console.log('1');
  unlock();
  console.log('2');
})();
```

will output 1, 2, 3, 4.

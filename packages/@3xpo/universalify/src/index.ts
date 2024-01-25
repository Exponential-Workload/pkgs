'use strict';

export type RemoveLast<T extends any[]> = T extends [...infer Rest, any]
  ? Rest
  : never;

export const fromCallback = <
  Return,
  T extends (...args: [...any, (err: any, res: Return) => void]) => void,
>(
  fn: T,
) => {
  return Object.defineProperty(
    // i hate the this keyword
    function (...args: RemoveLast<Parameters<T>>) {
      if (typeof args[args.length - 1] === 'function') fn.apply(this, args);
      else {
        return new Promise((resolve, reject) => {
          args.push((err: any, res: Return) =>
            err !== null && err !== undefined ? reject(err) : resolve(res),
          );
          fn.apply(this, args);
        });
      }
    },
    'name',
    { value: fn.name },
  ) as (...args: RemoveLast<Parameters<T>>) => Return;
};

export const fromPromise = <TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
) => {
  return Object.defineProperty(
    function (...args: [...TArgs, (err: any, result?: TResult) => void]) {
      const cb = args[args.length - 1];
      if (typeof cb !== 'function') {
        // If the last argument is not a function, assume it's a regular call and apply `fn`
        return fn.apply(this, args as unknown as TArgs);
      } else {
        // Remove the callback from the arguments list
        const fnArgs = args.slice(0, -1) as TArgs;
        fn.apply(this, fnArgs)
          .then(result => cb(null, result))
          .catch(err => cb(err));
      }
    },
    'name',
    { value: fn.name },
  );
};

export default {
  fromPromise,
  fromCallback,
};

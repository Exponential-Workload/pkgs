'use strict';

export type RemoveLast<T extends any[]> = T extends [...infer Rest, any]
  ? Rest
  : never;

// A generic type for the callback function
type Callback<Return> = (err: any, res: Return) => void;

export const fromCallback = <Args extends any[], Return>(
  fn: (...args: [...Args, Callback<Return>]) => void,
) => {
  return Object.defineProperty(
    function (...args: Args) {
      const lastArg = args[args.length - 1];
      if (typeof lastArg === 'function') {
        // Call the original function if the last argument is a function
        fn.apply(this, args as any as [...Args, Callback<Return>]);
      } else {
        // Return a promise if the last argument is not a function
        return new Promise<Return>((resolve, reject) => {
          const callback: Callback<Return> = (err, res) => {
            if (err !== null && err !== undefined) {
              reject(err);
            } else {
              resolve(res);
            }
          };
          fn.apply(this, [...args, callback]);
        });
      }
    },
    'name',
    { value: fn.name },
  ) as (...args: Args) => Promise<Return> | void;
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

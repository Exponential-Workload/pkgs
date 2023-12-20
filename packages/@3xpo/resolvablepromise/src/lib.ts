export type PromiseResolutionFunction<T> = (value: T | PromiseLike<T>) => void;
export type PromiseRejectionFunction = (reason?: any) => void;
export type PromiseCallbackFunction<T> = (
  resolve: PromiseResolutionFunction<T>,
  reject: PromiseRejectionFunction,
) => void;

/** Promise Wrapper with .state to check if it's resolved, rejected or nothing - aswell as getting the return value */
class RawStatePromise<
  T,
  Resolved extends boolean = boolean,
  Rejected extends boolean = boolean,
> extends Promise<T> {
  /** Due to the {@link RawStatePromise.rejected} value, we can catch created promises to prevent node from exiting due to uncaught promises. This must be changed prior to promise creation to be effective. This does not affect the .catch() method; we just add our own blank catch handler. */
  public static catchNewlyCreatedPromises = true;
  /** If the promise resolved */
  // @ts-ignore
  public resolved: Resolved = false;
  /** If the promise was rejected */
  // @ts-ignore
  public rejected: Rejected = false;
  /** The success value, if the promise was resolved */
  public value: Resolved extends true ? T : never;
  /** The error value, if an error was thrown */
  public error: Rejected extends true ? any : never;
  /** If the promise has either resolved or rejected */
  public get completed() {
    return this.resolved || this.rejected;
  }
  public constructor(callback: PromiseCallbackFunction<T>) {
    super(((res, rej) => {
      return callback(
        (value: T) => {
          const p = this as RawStatePromise<T, true, false>;
          p.resolved = true;
          p.value = value;
          return res(value);
        },
        reason => {
          if (RawStatePromise.catchNewlyCreatedPromises)
            this.catch(() => void 0); // ensure there's a handler
          const p = this as RawStatePromise<T, false, true>;
          p.rejected = true;
          p.error = reason;
          return rej(reason);
        },
      );
    }) satisfies PromiseCallbackFunction<T>);
  }
}
export class StatePromise<T> extends RawStatePromise<T> {}
/** Promise Wrapper with .resolve and .reject methods */
export class ResolvablePromise<T> extends StatePromise<T> {
  public resolve: PromiseResolutionFunction<T>;
  public reject: PromiseRejectionFunction;
  public constructor(callback?: PromiseCallbackFunction<T> | undefined | null) {
    let resolve: PromiseResolutionFunction<T>;
    let reject: PromiseRejectionFunction;
    const _setRsRj = (res: typeof resolve, rej: typeof reject) => {
      this.resolve = res;
      this.reject = rej;
    };
    let setRsRj: typeof _setRsRj = (res, rej) => {
      resolve = res;
      reject = rej;
    };
    super(((res, rej) => {
      resolve = res;
      reject = rej;
      setRsRj(res, rej);
      if (callback) return callback(res, rej);
    }) satisfies PromiseCallbackFunction<T>);
    if (typeof resolve !== 'undefined' && typeof reject !== 'undefined') {
      this.resolve = resolve;
      this.reject = reject;
    }
  }
}
export default ResolvablePromise;

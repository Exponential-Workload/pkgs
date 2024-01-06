/**!
 * MIT License
 *
 * Copyright (c) 2023 Expo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export type PromiseResolutionFunction<T> = T extends undefined
  ? () => void
  : (value: T | PromiseLike<T>) => void;
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
        // @ts-ignore
        (value: T) => {
          const p = this as RawStatePromise<T, true, false>;
          p.resolved = true;
          p.value = value;
          return res(value ?? void 0);
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
    setRsRj = _setRsRj;
  }
}
export default ResolvablePromise;

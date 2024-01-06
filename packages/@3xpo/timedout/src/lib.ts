export const timeout = <T>(
  promise: Promise<T>,
  timeoutError: string | Error = `Timed out`,
  timeout = 1000,
  /** What to call on a timeout - Useful for cancelling any pending work */
  onTimeout?: () => void,
  /** The Promise implementation to use; can be @3xpo/resolvablepromise or Promise */
  PromiseImplementation = Promise,
): Promise<T> => {
  let resolved = false;
  promise.then(v => {
    resolved = true;
    return v;
  });
  return PromiseImplementation.race([
    promise,
    new PromiseImplementation<T>((rs, rj) => {
      const t = setTimeout(() => {
        if (resolved) rs(void 0 as unknown as never);
        else {
          if (onTimeout) onTimeout();
          rj(
            timeoutError instanceof Error
              ? timeoutError
              : new Error(timeoutError),
          );
        }
      }, timeout);
      promise.then(() => {
        rs(void 0 as unknown as never);
        clearTimeout(t);
      });
    }),
  ]);
};
export default timeout;

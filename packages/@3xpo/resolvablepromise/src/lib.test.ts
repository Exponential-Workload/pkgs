import ResolvablePromise, { PromiseCallbackFunction } from './lib';

describe('ResolvablePromise', () => {
  it('should resolve with the correct value', async () => {
    const expectedValue = 'resolved value';
    const promise = new ResolvablePromise<string>(resolve => {
      setTimeout(() => {
        resolve(expectedValue);
      }, 100);
    });

    const result = await promise;

    expect(result).toBe(expectedValue);
    expect(promise.resolved).toBe(true);
    expect(promise.value).toBe(expectedValue);
    expect(promise.rejected).toBe(false);
    expect(promise.error).toBe(undefined);
  });

  it('should reject with the correct reason', async () => {
    const expectedReason = 'rejection reason';
    const promise = new ResolvablePromise<string>((_, reject) => {
      setTimeout(() => {
        reject(expectedReason);
      }, 100);
    });

    try {
      await promise;
    } catch (error) {
      expect(error).toBe(expectedReason);
      expect(promise.resolved).toBe(false);
      expect(promise.value).toBe(undefined);
      expect(promise.rejected).toBe(true);
      expect(promise.error).toBe(expectedReason);
    }
  });

  it('should execute the callback function', async () => {
    const callback: PromiseCallbackFunction<string> = jest.fn(resolve => {
      setTimeout(() => {
        resolve('callback value');
      }, 100);
    });

    const promise = new ResolvablePromise<string>(callback);

    await promise;

    expect(callback).toHaveBeenCalled();
  });

  it('should resolve when called via a method', async () => {
    const callback = jest.fn();
    const promise = new ResolvablePromise<undefined>();

    promise.then(callback);

    setTimeout(() => promise.resolve());

    await promise;

    expect(callback).toHaveBeenCalled();
  });

  it('should reject when called via a method', async () => {
    const thenHandler = jest.fn();
    const catchHandler = jest.fn();
    const tryCatchHandler = jest.fn();
    const promise = new ResolvablePromise<undefined>();

    promise.then(thenHandler);
    promise.catch(catchHandler);

    const err = new Error('fake error');

    setTimeout(() => promise.reject(err));

    try {
      await promise;
    } catch (error) {
      tryCatchHandler(error);
    }

    expect(thenHandler).toHaveBeenCalledTimes(0);
    expect(catchHandler).toHaveBeenCalledWith(err);
    expect(tryCatchHandler).toHaveBeenCalledWith(err);
  });
});

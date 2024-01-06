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

  const delayedPromise = <T>(
    value: T,
    delay: number,
    isBuiltinImpl = false,
  ): Promise<T> | ResolvablePromise<T> =>
    new (isBuiltinImpl ? Promise : ResolvablePromise)(resolve =>
      setTimeout(() => resolve(value), delay),
    );
  describe('ResolvablePromiseConstructor.all', () => {
    test('should be instanceof Promise', async () => {
      expect(ResolvablePromise.all([Promise.resolve('hi')])).toBeInstanceOf(
        Promise,
      );
    });

    test('should be instanceof ResovlablePromise', async () => {
      expect(ResolvablePromise.all([Promise.resolve('hi')])).toBeInstanceOf(
        ResolvablePromise,
      );
    });

    test('should resolve with an array of resolved values', async () => {
      const promises = [
        delayedPromise('one', 100),
        delayedPromise('two', 200, true),
        delayedPromise('three', 300),
      ];

      const result = await (ResolvablePromise.all(
        promises,
      ) satisfies ResolvablePromise<string[]>);

      expect(result).toEqual(['one', 'two', 'three']);
    });

    test('should reject if any promise in the array rejects', async () => {
      const promises = [
        delayedPromise('success', 100),
        Promise.reject('error'),
        delayedPromise('another success', 200, true),
      ];

      await expect(
        ResolvablePromise.all(promises) satisfies ResolvablePromise<string[]>,
      ).rejects.toEqual('error');
    });
  });

  describe('ResolvablePromiseConstructor.race', () => {
    test('should be instanceof Promise', async () => {
      expect(ResolvablePromise.race([Promise.resolve('hi')])).toBeInstanceOf(
        Promise,
      );
    });

    test('should be instanceof ResovlablePromise', async () => {
      expect(ResolvablePromise.race([Promise.resolve('hi')])).toBeInstanceOf(
        ResolvablePromise,
      );
    });

    test('should resolve with the first resolved value', async () => {
      const promises = [
        delayedPromise('one', 200),
        delayedPromise('two', 100, true),
        delayedPromise('three', 300),
      ];

      const result = await ResolvablePromise.race(promises);

      expect(result).toEqual('two');
    });

    test('should reject with the first rejected value', async () => {
      const promises = [
        delayedPromise('success', 200),
        Promise.reject('first error'),
        delayedPromise('another success', 100),
        Promise.reject('second error'),
      ];

      await expect(ResolvablePromise.race(promises)).rejects.toEqual(
        'first error',
      );
    });
  });
});

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
});

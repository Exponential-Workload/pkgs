import timedout from './lib';
describe('@3xpo/timedout', () => {
  const mockPromise = <T>(result: T, delay: number) =>
    new Promise<T>(resolve => setTimeout(() => resolve(result), delay));

  it('should resolve with the value when the promise resolves within the timeout', async () => {
    const result = await timedout(
      mockPromise('success', 50),
      'Timeout error',
      1000,
    );
    expect(result).toEqual('success');
  });

  it('should reject with the specified timeout error when the promise takes too long', async () => {
    await expect(
      timedout(mockPromise('success', 150), 'Timeout error', 100),
    ).rejects.toThrow('Timeout error');
  });

  it('should call onTimeout function when the promise times out', async () => {
    const onTimeoutMock = jest.fn();
    await expect(
      timedout(
        mockPromise('success', 150),
        'Timeout error',
        100,
        onTimeoutMock,
      ),
    ).rejects.toThrow('Timeout error');
    expect(onTimeoutMock).toHaveBeenCalledTimes(1);
  });
});

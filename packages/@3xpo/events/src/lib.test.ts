import EventEmitter from '..';

describe('EventEmitter', () => {
  let emitter: EventEmitter<{
    event: (arg1: string, arg2: number) => void;
    event1: () => void;
    event2: () => void;
  }>;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  test('should add and emit event', () => {
    const callback = jest.fn();
    emitter.on('event', callback);
    emitter.emit('event', 'hello', 123);
    expect(callback).toHaveBeenCalledWith('hello', 123);
  });

  test('should remove listener', () => {
    const callback = jest.fn();
    emitter.on('event', callback);
    emitter.off('event', callback);
    emitter.emit('event', 'hello', 123);
    expect(callback).not.toHaveBeenCalled();
  });

  test('should remove all listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    emitter.on('event', callback1);
    emitter.on('event', callback2);
    emitter.removeAllListeners('event');
    emitter.emit('event', 'hello', 123);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  test('should return event names', () => {
    emitter.on('event1', () => {});
    emitter.on('event2', () => {});
    expect(emitter.eventNames()).toEqual(['event1', 'event2']);
  });

  test('should return listener count', () => {
    emitter.on('event', () => {});
    emitter.on('event', () => {});
    expect(emitter.listenerCount('event')).toBe(2);
  });

  test('should work with once', () => {
    const callback = jest.fn();
    emitter.once('event', callback);
    emitter.emit('event', 'hello', 123);
    expect(callback).toHaveBeenCalledWith('hello', 123);
    callback.mockClear();
    emitter.emit('event', 'hello', 123);
    expect(callback).not.toHaveBeenCalled();
  });

  test('should work with prependListener', () => {
    const callback = jest.fn();
    emitter.on('event', () => {});
    emitter.prependListener('event', callback);
    emitter.emit('event', 'hello', 123);
    expect(callback).toHaveBeenCalledWith('hello', 123);
  });
  test('should work with prependOnceListener', () => {
    const callback = jest.fn();
    emitter.on('event', () => {});
    emitter.prependOnceListener('event', callback);
    emitter.emit('event', 'hello', 123);
    expect(callback).toHaveBeenCalledWith('hello', 123);
    callback.mockClear();
    emitter.emit('event', 'hello', 123);
    expect(callback).not.toHaveBeenCalled();
  });
});

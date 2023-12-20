import Locked from './lib';

describe('@3xpo/locked', () => {
  let locked: Locked;

  beforeEach(() => {
    locked = new Locked();
  });

  test('should not have race conditions', async () => {
    const results: string[] = [];
    const asyncTask = async (key: string, result: string, t = 0) => {
      const unlock = await locked.lock(key);
      if (t) await new Promise(rs => setTimeout(rs, t));
      results.push(result);
      unlock();
    };
    const promises = [
      asyncTask('test', 'Task 1'),
      asyncTask('test', 'Task 2'),
      asyncTask('test', 'Task 3', 300),
      asyncTask('test', 'Task 4'),
    ];
    await Promise.all(promises);
    expect(results).toEqual(['Task 1', 'Task 2', 'Task 3', 'Task 4']);
  });

  test('should handle multiple locks independently', async () => {
    const results: Record<string, string[]> = {};
    const asyncTask = async (key: string, result: string) => {
      results[key] = results[key] ?? [];
      const unlock = await locked.lock(key);
      await new Promise(rs => setTimeout(rs, Math.random() * 10));
      results[key].push(result);
      unlock();
    };
    const promises = [
      asyncTask('lock1', 'Task 1'),
      asyncTask('lock2', 'Task 2'),
      asyncTask('lock1', 'Task 3'),
      asyncTask('lock2', 'Task 4'),
    ];
    await Promise.all(promises);
    expect(results.lock1).toEqual(['Task 1', 'Task 3']);
    expect(results.lock2).toEqual(['Task 2', 'Task 4']);
  });

  test('should return the value passed to unlock', async () => {
    const results: Record<string, string[]> = {};
    const asyncTask = async (key: string, result: string) => {
      results[key] = results[key] ?? [];
      const unlock = await locked.lock(key);
      await new Promise(rs => setTimeout(rs, Math.random() * 10));
      results[key].push(result);
      unlock();
    };
    const promises = [
      asyncTask('lock1', 'Task 1'),
      asyncTask('lock2', 'Task 2'),
      asyncTask('lock1', 'Task 3'),
      asyncTask('lock2', 'Task 4'),
    ];
    await Promise.all(promises);
    expect(results.lock1).toEqual(['Task 1', 'Task 3']);
    expect(results.lock2).toEqual(['Task 2', 'Task 4']);
  });
});

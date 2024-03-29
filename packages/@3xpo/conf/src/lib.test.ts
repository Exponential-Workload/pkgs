import Config from './lib';
import { string, number, object } from 'zod';

describe('@3xpo/conf', () => {
  test('should emit "change" event and update config when set is called', () => {
    const defaultConfig = { key1: 'value1', key2: 42 };
    const config = new Config(
      defaultConfig,
      object({ key1: string(), key2: number() }),
    );
    const spyCallback = jest.fn();
    config.on('change', spyCallback);

    config.set('key1', 'new-value1');
    expect(spyCallback).toHaveBeenCalledWith('key1', 'new-value1', 'value1');
    expect(config.get('key1')).toBe('new-value1');
  });

  test('should not emit "change" event if the value is set to the same', () => {
    const defaultConfig = { key1: 'value1', key2: 42 };
    const config = new Config(
      defaultConfig,
      object({ key1: string(), key2: number() }),
    );
    const spyCallback = jest.fn();
    config.on('change', spyCallback);

    config.set('key1', 'value1'); // Setting to the same value
    expect(spyCallback).not.toHaveBeenCalled();
  });

  test('should handle multiple properties independently', () => {
    const defaultConfig = { key1: 'value1', key2: 42 };
    const config = new Config(
      defaultConfig,
      object({ key1: string(), key2: number() }),
    );
    const spyCallback = jest.fn();
    config.on('change', spyCallback);

    config.set('key1', 'new-value1');
    config.set('key2', 100);

    expect(spyCallback).toHaveBeenCalledWith('key1', 'new-value1', 'value1');
    expect(spyCallback).toHaveBeenCalledWith('key2', 100, 42);
    expect(config.get('key1')).toBe('new-value1');
    expect(config.get('key2')).toBe(100);
  });

  test('should throw errors when setting incorrect data when zod object is passed', () => {
    const defaultConfig = { key1: 'value1', key2: 42 };
    const config = new Config(
      defaultConfig,
      object({ key1: string(), key2: number() }),
    );

    expect(() => config.set('key2', 'invalid' as unknown as number)).toThrow();
  });

  test('should handle import and export correctly', () => {
    const defaultConfig = { key1: 'value1', key2: 42 };
    const config = new Config(
      defaultConfig,
      object({ key1: string(), key2: number() }),
    );
    const spyCallback = jest.fn();
    config.on('change', spyCallback);

    const exportedConfig = config.export();
    const importedConfig = new Config(
      defaultConfig,
      object({ key1: string(), key2: number() }),
    );
    importedConfig.import(exportedConfig);

    expect(importedConfig.toJSON()).toEqual(defaultConfig);
  });
});

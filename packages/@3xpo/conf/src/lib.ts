import EventEmitter from '@3xpo/events';

const clone =
  typeof structuredClone !== 'undefined'
    ? structuredClone
    : <T>(v: T): T => JSON.parse(JSON.stringify(v));

export class Config<Conf extends Record<string, unknown>> extends EventEmitter<{
  change: <K extends keyof Conf>(
    key: K,
    newValue: Conf[K],
    oldValue: Conf[K],
  ) => void;
}> {
  protected config: Conf;

  public constructor(protected defaultConfig: Conf) {
    super();
    this.reset();
    this.on('change', (key, value) => (this.config[key] = value));
  }

  public set<K extends keyof Conf>(key: K, val: Conf[K]) {
    const old = this.get(key);
    if (val !== old) this.emit('change', key, val, old);
    return this;
  }

  public get<K extends keyof Conf>(key: K): Conf[K] {
    return this.config[key];
  }

  /** Resets a specific key if a key is passed, otherwise resets the entire */
  public reset(k?: keyof Conf) {
    if (k in this.defaultConfig) this.config[k] = clone(this.defaultConfig)[k];
    else this.config = clone(this.defaultConfig);
  }
}
export default Config;

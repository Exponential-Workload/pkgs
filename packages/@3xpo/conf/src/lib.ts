import EventEmitter from '@3xpo/events';
import type { ZodType, ZodObject } from 'zod';

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

  public constructor(
    protected defaultConfig: Conf,
    protected zodType?: ZodType<Conf>,
  ) {
    if (zodType) zodType.parse(defaultConfig);
    super();
    this.reset();
    this.on('change', (key, value) => (this.config[key] = value));
  }

  public set<K extends keyof Conf>(key: K, val: Conf[K]) {
    const validation = (this.zodType as unknown as ZodObject<{}>)?.shape[
      key as any
    ] as ZodType;
    if (validation) validation.parse(val);
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

  /** Return the config as a string */
  public export() {
    return JSON.stringify(this);
  }

  /** Returns the JSON value */
  public toJSON() {
    return this.config;
  }

  /** Import a config from a string or a config */
  public import(cfg: Partial<Conf> | string) {
    if (typeof cfg === 'string') cfg = JSON.parse(cfg) as Partial<Conf>;
    this.config = this.zodType?.parse({
      ...this.config,
      ...cfg,
    }) ?? {
      ...this.config,
      ...cfg,
    };
  }
}
export default Config;

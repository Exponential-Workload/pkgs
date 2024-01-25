import fs from 'fs/promises';
import fsSync from 'fs';
import universalify from '@3xpo/universalify';
import { type StringifyOptions, stringify, stripBom } from './utils';

export type Options = Partial<
  {
    encoding: BufferEncoding | null;
    reviver: Parameters<typeof JSON.parse>[1] | null;
    throws: boolean;
  } & StringifyOptions
>;

export const readFile = universalify.fromPromise(
  async (file: string, options: Options | BufferEncoding = {}) => {
    if (typeof options === 'string') {
      options = { encoding: options };
    }

    const shouldThrow = 'throws' in options ? options.throws : true;

    let data = await fs.readFile(file, {
      encoding: options.encoding ?? 'utf-8',
    });

    data = stripBom(data);

    let obj: any;
    try {
      obj = JSON.parse(data, options?.reviver ?? undefined);
    } catch (err) {
      if (shouldThrow) {
        err.message = `${file}: ${err.message}`;
        throw err;
      } else {
        return null;
      }
    }

    return obj;
  },
);

export const readFileSync = (
  file: string,
  options: Options | BufferEncoding = {},
) => {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  const shouldThrow = 'throws' in options ? options.throws : true;

  try {
    let content = fsSync.readFileSync(file, options);
    content = stripBom(content);
    return JSON.parse(content.toString(), options?.reviver ?? undefined);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
};

export const writeFile = universalify.fromPromise(
  async (file, obj, options: Options = {}) => {
    const str = stringify(obj, options);

    await fs.writeFile(file, str, options);
  },
);

export const writeFileSync = (file: string, obj: any, options = {}) => {
  const str = stringify(obj, options);
  // not sure if fs.writeFileSync returns anything, but just in case
  return fsSync.writeFileSync(file, str, options);
};

const jsonfile = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
};

export default jsonfile;

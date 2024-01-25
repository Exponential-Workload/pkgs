'use strict';

import { StringifyOptions, stringify } from '../jsonfile/utils';
import { outputFile } from '../output-file';
import { WriteFileOptions } from 'graceful-fs';

export const outputJson = async (
  file: string,
  data: any,
  options?: Partial<
    StringifyOptions | WriteFileOptions | (StringifyOptions & WriteFileOptions)
  >,
) => {
  const str = stringify(data, options as any);

  await outputFile(file, str, options as any);
};

export default outputJson;

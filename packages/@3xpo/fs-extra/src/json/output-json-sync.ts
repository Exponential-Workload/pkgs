'use strict';

import { StringifyOptions, stringify } from '../jsonfile/utils';
import { outputFileSync } from '../output-file';
import { WriteFileOptions } from 'graceful-fs';

export const outputJsonSync = (
  file: string,
  data: any,
  options?: Partial<
    StringifyOptions | WriteFileOptions | (StringifyOptions & WriteFileOptions)
  >,
) => {
  const str = stringify(data, options as any);

  outputFileSync(file, str, options as any);
};

export default outputJsonSync;

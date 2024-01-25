// Import promiseified graceful-fs:
import * as fs from './fs';

// Import extra methods:
import * as copy from './copy';
import * as empty from './empty';
import * as ensure from './ensure';
import * as json from './json';
import * as mkdirs from './mkdirs';
import * as move from './move';
import * as outputFile from './output-file';
import * as pathExists from './path-exists';
import * as remove from './remove';

const defaultExport = {
  ...(fs as Record<never, never>), // hide the type
  ...fs.constants,
  ...copy,
  ...empty,
  ...ensure,
  ...json,
  ...mkdirs,
  ...move,
  ...outputFile,
  ...pathExists,
  ...remove,
};

export default defaultExport as typeof defaultExport & // re-show the type, and force overwrite all others, because why not
  typeof fs &
  typeof fs.constants &
  typeof copy &
  typeof empty &
  typeof ensure &
  typeof json &
  typeof mkdirs &
  typeof move &
  typeof outputFile &
  typeof pathExists &
  typeof remove;

export {
  fs,
  copy,
  empty,
  ensure,
  json,
  mkdirs,
  move,
  outputFile,
  pathExists,
  remove,
};

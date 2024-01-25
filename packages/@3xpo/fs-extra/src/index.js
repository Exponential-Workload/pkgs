// Use strict mode is not required in ES6 modules

// Import promiseified graceful-fs:
export * as fs from './fs';

// Import extra methods:
export * as copy from './copy';
export * as empty from './empty';
export * as ensure from './ensure';
export * as json from './json';
export * as mkdirs from './mkdirs';
export * as move from './move';
export * as outputFile from './output-file';
export * as pathExists from './path-exists';
export * as remove from './remove';

export default {
  ...fs,
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

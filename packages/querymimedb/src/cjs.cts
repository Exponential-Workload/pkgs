import Addon from './addon';
import jsSpace from './js-space';

const externalRequire = require;

export const addon: Addon = externalRequire(
  '../build/Release/querymimedb.node',
);
export const query = jsSpace(addon);

export * as exceptions from './exceptions';
export default query;

import Addon from './addon';
import jsSpace, { QueryFunc } from './js-space';

const externalRequire = require;

export const addon: Addon = externalRequire(
  '../build/Release/querymimedb.node',
);
/** See {@link QueryFunc Query} for information. */
export const query: QueryFunc = jsSpace(addon);

export * as exceptions from './exceptions';
export default query;

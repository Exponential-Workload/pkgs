import { createRequire } from 'node:module';
import Addon from './addon';
import jsSpace, { QueryFunc } from './js-space';

// @ts-ignore import.meta does exist, kill yourself
const cjsRequire = createRequire(import.meta.url);

export const addon: Addon = cjsRequire('../build/Release/querymimedb.node');
/** See {@link QueryFunc Query} for information. */
export const query: QueryFunc = jsSpace(addon);

export * as exceptions from './exceptions';
export default query;

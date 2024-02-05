import { createRequire } from 'node:module';
import Addon from './addon';
import jsSpace from './js-space';

// @ts-ignore import.meta does exist, kill yourself
const cjsRequire = createRequire(import.meta.url);

export const addon: Addon = cjsRequire('../build/Release/querymimedb.node');
export const query = jsSpace(addon);

export * as exceptions from './exceptions';
export default query;

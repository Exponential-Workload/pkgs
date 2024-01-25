'use strict';

import { fromPromise } from '@3xpo/universalify';
import {
  createFile as _createFile,
  createFileSync as _createFileSync,
} from './file';
import {
  createLink as _createLink,
  createLinkSync as _createLinkSync,
} from './link';
import {
  createSymlink as _createSymlink,
  createSymlinkSync as _createSymlinkSync,
} from './symlink';

// file
export const createFile = fromPromise(_createFile);
export const createFileSync = _createFileSync;
export const ensureFile = fromPromise(_createFile);
export const ensureFileSync = _createFileSync;
// link
export const createLink = fromPromise(_createLink);
export const createLinkSync = _createLinkSync;
export const ensureLink = fromPromise(_createLink);
export const ensureLinkSync = _createLinkSync;
// symlink
export const createSymlink = fromPromise(_createSymlink);
export const createSymlinkSync = _createSymlinkSync;
export const ensureSymlink = fromPromise(_createSymlink);
export const ensureSymlinkSync = _createSymlinkSync;

export default {
  // file
  createFile,
  createFileSync,
  ensureFile: createFile,
  ensureFileSync: createFileSync,
  // link
  createLink,
  createLinkSync,
  ensureLink: createLink,
  ensureLinkSync: createLinkSync,
  // symlink
  createSymlink,
  createSymlinkSync,
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync,
};

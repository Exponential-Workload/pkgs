'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../../..';
import { copy as ncp } from '../../';
import path from 'path';
import { fromCallback } from '@3xpo/universalify';

/* global afterEach, beforeEach, describe, it */

describe('ncp / symlink', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'ncp-symlinks');
  const src = path.join(TEST_DIR, 'src');
  const out = path.join(TEST_DIR, 'out');

  beforeEach(async () => {
    await fse.emptyDir(TEST_DIR);
    return await fromCallback(createFixtures)(src);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('copies symlinks by default', done => {
    ncp(src, out)
      .catch(err => err)
      .then(err => {
        expect(err).toBeFalsy();

        expect(fs.readlinkSync(path.join(out, 'file-symlink'))).toBe(
          path.join(src, 'foo'),
        );
        expect(fs.readlinkSync(path.join(out, 'dir-symlink'))).toBe(
          path.join(src, 'dir'),
        );

        done();
      });
  });

  it('copies file contents when dereference=true', async () => {
    await ncp(src, out, { dereference: true });
    const fileSymlinkPath = path.join(out, 'file-symlink');
    expect(fs.lstatSync(fileSymlinkPath).isFile()).toBeTruthy();
    expect(fs.readFileSync(fileSymlinkPath, 'utf8')).toStrictEqual(
      'foo contents',
    );
    const dirSymlinkPath = path.join(out, 'dir-symlink');
    expect(fs.lstatSync(dirSymlinkPath).isDirectory()).toBeTruthy();
    expect(fs.readdirSync(dirSymlinkPath)).toEqual(['bar']);
  });
});

function createFixtures(srcDir, callback) {
  fs.promises
    .mkdir(srcDir)
    .catch(err => err)
    .then(err => {
      if (err) return callback(err);

      // note: third parameter in symlinkSync is type e.g. 'file' or 'dir'
      // https://nodejs.org/api/fs.html#fs_fs_symlink_srcpath_dstpath_type_callback
      try {
        const fooFile = path.join(srcDir, 'foo');
        const fooFileLink = path.join(srcDir, 'file-symlink');
        fs.writeFileSync(fooFile, 'foo contents');
        fs.symlinkSync(fooFile, fooFileLink, 'file');

        const dir = path.join(srcDir, 'dir');
        const dirFile = path.join(dir, 'bar');
        const dirLink = path.join(srcDir, 'dir-symlink');
        fs.mkdirSync(dir);
        fs.writeFileSync(dirFile, 'bar contents');
        fs.symlinkSync(dir, dirLink, 'dir');
      } catch (err) {
        callback(err);
      }

      callback();
    });
}

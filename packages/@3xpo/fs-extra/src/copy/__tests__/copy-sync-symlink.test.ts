'use strict';

import * as os from 'os';
import fs from '../..';
import path from 'path';
import copySync from '../copy-sync';

/* global afterEach, beforeEach, describe, it */

describe('copy-sync / symlink', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy-sync-symlinks');
  const src = path.join(TEST_DIR, 'src');
  const out = path.join(TEST_DIR, 'out');

  beforeEach(done => {
    fs.emptyDir(TEST_DIR, err => {
      expect(err).toBeFalsy();
      createFixtures(src, done);
    });
  });

  afterEach(done => {
    fs.remove(TEST_DIR)
      .catch(err => err)
      .then(done);
  });

  it('copies symlinks by default', () => {
    expect(() => {
      copySync(src, out);
    }).not.toThrow();

    expect(fs.readlinkSync(path.join(out, 'file-symlink'))).toBe(
      path.join(src, 'foo'),
    );
    expect(fs.readlinkSync(path.join(out, 'dir-symlink'))).toBe(
      path.join(src, 'dir'),
    );
  });

  it('copies file contents when dereference=true', () => {
    try {
      copySync(src, out, { dereference: true });
    } catch (err) {
      expect(err).toBeFalsy();
    }

    const fileSymlinkPath = path.join(out, 'file-symlink');
    expect(fs.lstatSync(fileSymlinkPath).isFile()).toBeTruthy();
    expect(fs.readFileSync(fileSymlinkPath, 'utf8')).toBe('foo contents');

    const dirSymlinkPath = path.join(out, 'dir-symlink');
    expect(fs.lstatSync(dirSymlinkPath).isDirectory()).toBeTruthy();
    expect(fs.readdirSync(dirSymlinkPath)).toEqual(['bar']);
  });
});

function createFixtures(srcDir, callback) {
  fs.mkdir(srcDir, err => {
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

'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../../..';
import { copy as ncp } from '../../';
import path from 'path';
import assert from 'assert';
import { fromCallback } from '@3xpo/universalify';

/* global afterEach, beforeEach, describe, it */

describe('ncp / symlink', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'ncp-symlinks');
  const src = path.join(TEST_DIR, 'src');
  const out = path.join(TEST_DIR, 'out');

  beforeEach(async () => {
    const err = await fse.emptyDir(TEST_DIR);
    assert.ifError(err);
    return await fromCallback(createFixtures)(src);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('copies symlinks by default', done => {
    ncp(src, out)
      .catch(err => err)
      .then(err => {
        assert.ifError(err);

        assert.strictEqual(
          fs.readlinkSync(path.join(out, 'file-symlink')),
          path.join(src, 'foo'),
        );
        assert.strictEqual(
          fs.readlinkSync(path.join(out, 'dir-symlink')),
          path.join(src, 'dir'),
        );

        done();
      });
  });

  it('copies file contents when dereference=true', done => {
    ncp(src, out, { dereference: true })
      .catch(err => err)
      .then(err => {
        assert.ifError(err);

        const fileSymlinkPath = path.join(out, 'file-symlink');
        assert.ok(fs.lstatSync(fileSymlinkPath).isFile());
        assert.strictEqual(
          fs.readFileSync(fileSymlinkPath, 'utf8'),
          'foo contents',
        );

        const dirSymlinkPath = path.join(out, 'dir-symlink');
        assert.ok(fs.lstatSync(dirSymlinkPath).isDirectory());
        assert.deepStrictEqual(fs.readdirSync(dirSymlinkPath), ['bar']);

        done();
      });
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
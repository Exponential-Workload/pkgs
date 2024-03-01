// @ts-nocheck
'use strict';
import * as fs from 'fs';
import * as os from 'os';
import fse from '../../..';
import { copy as ncp } from '../../';
import path from 'path';
import type { URL } from 'url';

const createFixtures = (
  srcDir: fs.PathLike,
  callback: string | ((arg0: NodeJS.ErrnoException) => void),
) => {
  fs.mkdir(srcDir, err => {
    let brokenFile: string | number | Buffer | URL;
    let brokenFileLink: fs.PathLike;

    if (err) return callback(err);

    try {
      brokenFile = path.join(srcDir, 'does-not-exist');
      brokenFileLink = path.join(srcDir, 'broken-symlink');
      fs.writeFileSync(brokenFile, 'does not matter');
      fs.symlinkSync(brokenFile, brokenFileLink, 'file');
    } catch (err) {
      callback(err);
    }

    // break the symlink now
    fse.remove(brokenFile, callback);
  });
};

/* global afterEach, beforeEach, describe, it */

describe('ncp broken symlink', () => {
  const TEST_DIR = path.join(
    os.tmpdir(),
    'fs-extra-test-suite',
    'ncp-broken-symlinks',
  );
  const src = path.join(TEST_DIR, 'src');
  const out = path.join(TEST_DIR, 'out');

  beforeEach(async () => {
    await fse.emptyDir(TEST_DIR);
    return await new Promise((rs, rj) =>
      createFixtures(src, e => (e ? rj(e) : rs(void 0))),
    );
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should not error if symlink is broken', async () => {
    const rt = await ncp(src, out)
      .then(v => ({
        err: false,
        val: v,
      }))
      .catch(e => ({
        err: true,
        val: e,
      }));

    expect(rt.err).toBe(false);
    expect(rt.val).toBe(void 0);
  });

  it('should return an error if symlink is broken and dereference=true', async () => {
    let rt: { err: false; val: void } | { err: true; val: any };
    try {
      rt = await ncp(src, out, { dereference: true })
        .then(v => ({
          err: false,
          val: v,
        }))
        .catch(e => ({
          err: true,
          val: e,
        }));
    } catch (error) {
      rt = {
        err: true,
        val: error,
      };
    }

    expect(rt.err).toBe(true);
    expect(rt.val.code).toBe('ENOENT');
  });
});

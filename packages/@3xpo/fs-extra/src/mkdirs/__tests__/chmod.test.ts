'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / chmod', () => {
  let TEST_DIR: string;
  let TEST_SUBDIR: string;

  beforeEach(() => {
    const ps = [] as any[];
    for (let i = 0; i < 15; i++) {
      const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      ps.push(dir);
    }

    TEST_SUBDIR = ps.join(path.sep);

    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp-chmod');
    TEST_SUBDIR = path.join(TEST_DIR, TEST_SUBDIR);

    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('chmod-pre', done => {
    const mode = 0o744;
    fse
      .mkdirp(TEST_SUBDIR, mode)
      .catch(err => err)
      .then(err => {
        assert.ifError(err);
        fs.stat(TEST_SUBDIR, (err, stat) => {
          assert.ifError(err);
          assert.ok(stat && stat.isDirectory(), 'should be directory');

          if (os.platform().indexOf('win') === 0) {
            assert.strictEqual(
              stat && stat.mode & 0o777,
              0o666,
              'windows shit',
            );
          } else {
            assert.strictEqual(
              stat && stat.mode & 0o777,
              mode,
              'should be 0744',
            );
          }

          done();
        });
      });
  });

  it('chmod', async () => {
    const mode = 0o755;
    await fse.mkdirp(TEST_SUBDIR, mode);
    const stat = fs.statSync(TEST_SUBDIR);
    assert.ok(stat && stat.isDirectory(), 'should be directory');
  });
});

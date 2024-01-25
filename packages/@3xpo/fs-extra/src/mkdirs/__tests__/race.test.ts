'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / race', () => {
  let TEST_DIR: string;
  let file: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp-race');
    await fse.emptyDir(TEST_DIR);

    const ps = [TEST_DIR];

    for (let i = 0; i < 15; i++) {
      const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      ps.push(dir);
    }

    file = path.join(...ps);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true }));

  it('race', done => {
    let res = 2;

    mk(file, () => (--res === 0 ? done() : undefined));
    mk(file, () => (--res === 0 ? done() : undefined));

    function mk(file, callback) {
      fse
        .mkdirp(file, 0o755)
        .catch(err => err)
        .then(err => {
          assert.ifError(err);
          fse.pathExists(file, (err, ex) => {
            assert.ifError(err);
            assert.ok(ex, 'file created');
            fs.stat(file, (err, stat) => {
              assert.ifError(err);

              if (os.platform().indexOf('win') === 0) {
                assert.strictEqual(stat.mode & 0o777, 0o666);
              } else {
                assert.strictEqual(stat.mode & 0o777, 0o755);
              }

              assert.ok(stat.isDirectory(), 'target not a directory');
              if (callback) callback();
            });
          });
        });
    }
  });
});

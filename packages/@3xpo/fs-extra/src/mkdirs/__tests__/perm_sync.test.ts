'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / perm_sync', () => {
  let TEST_DIR: string;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirp-perm-sync');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('sync perm', done => {
    const file = path.join(
      TEST_DIR,
      (Math.random() * (1 << 30)).toString(16) + '.json',
    );

    fse.mkdirpSync(file, 0o755);
    fse.pathExists(file, (err, ex) => {
      expect(err).toBeFalsy();
      expect(ex).toBeTruthy();
      fs.stat(file, (err, stat) => {
        expect(err).toBeFalsy();

        if (os.platform().indexOf('win') === 0) {
          expect(stat.mode & 0o777).toBe(0o666);
        } else {
          expect(stat.mode & 0o777).toBe(0o755);
        }

        expect(stat.isDirectory()).toBeTruthy();
        done();
      });
    });
  });

  it('sync root perm', done => {
    const file = TEST_DIR;
    fse.mkdirpSync(file, 0o755);
    fse.pathExists(file, (err, ex) => {
      expect(err).toBeFalsy();
      expect(ex).toBeTruthy();
      fs.stat(file, (err, stat) => {
        expect(err).toBeFalsy();
        expect(stat.isDirectory()).toBeTruthy();
        done();
      });
    });
  });
});

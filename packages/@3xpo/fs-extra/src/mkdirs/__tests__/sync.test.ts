'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('mkdirp / sync', () => {
  let TEST_DIR: string;
  let file;

  beforeEach(() => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'mkdirp-sync');
    return fse.emptyDir(TEST_DIR).then(() => {
      const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
      const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

      file = path.join(TEST_DIR, x, y, z);
    });
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  it('should', done => {
    try {
      fse.mkdirpSync(file, 0o755);
    } catch (err) {
      expect(false).toBe(true);
    }

    fse.pathExists(file, (err, ex) => {
      expect(err).toBeFalsy();
      expect(ex).toBeTruthy();
      fs.stat(file, (err, stat) => {
        expect(err).toBeFalsy();
        // http://stackoverflow.com/questions/592448/c-how-to-set-file-permissions-cross-platform
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
});

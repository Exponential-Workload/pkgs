'use strict';

// relevant: https://github.com/jprichardson/node-fs-extra/issues/89
// come up with better file name

import * as fs from 'fs';
import * as os from 'os';
import fse from '../../';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('copy() - gh #89', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy-gh-89');

  beforeEach(async () => {
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => {
    return fse.remove(TEST_DIR);
  });

  it('should copy successfully', done => {
    const A = path.join(TEST_DIR, 'A');
    const B = path.join(TEST_DIR, 'B');
    fs.mkdirSync(A);
    fs.mkdirSync(B);

    const one = path.join(A, 'one.txt');
    const two = path.join(A, 'two.txt');
    const three = path.join(B, 'three.txt');
    const four = path.join(B, 'four.txt');

    fs.writeFileSync(one, '1');
    fs.writeFileSync(two, '2');
    fs.writeFileSync(three, '3');
    fs.writeFileSync(four, '4');

    const C = path.join(TEST_DIR, 'C');
    fse
      .copy(A, C)
      .catch(err => err)
      .then(err => {
        if (err) return done(err);

        fse
          .copy(B, C)
          .catch(err => err)
          .then(err => {
            if (err) return done(err);

            expect(fs.existsSync(path.join(C, 'one.txt'))).toBeTruthy();
            expect(fs.existsSync(path.join(C, 'two.txt'))).toBeTruthy();
            expect(fs.existsSync(path.join(C, 'three.txt'))).toBeTruthy();
            expect(fs.existsSync(path.join(C, 'four.txt'))).toBeTruthy();
            done();
          });
      });
  });
});

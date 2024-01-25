'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global beforeEach, describe, it */

describe('mkdirs / opts-undef', () => {
  let TEST_DIR: string;

  beforeEach(done => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'mkdirs');
    fse.emptyDir(TEST_DIR, done);
  });

  // https://github.com/substack/node-mkdirp/issues/45
  it('should not hang', done => {
    const newDir = path.join(TEST_DIR, 'doest', 'not', 'exist');
    assert(!fs.existsSync(newDir));

    fse
      .mkdirs(newDir, undefined)
      .catch(err => err)
      .then(err => {
        assert.ifError(err);
        assert(fs.existsSync(newDir));
        done();
      });
  });
});

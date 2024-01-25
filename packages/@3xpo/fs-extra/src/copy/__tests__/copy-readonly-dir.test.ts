'use strict';

// relevant: https://github.com/jprichardson/node-fs-extra/issues/599

import fs from '../../';
import * as os from 'os';
import fse from '../../';
import path from 'path';
import assert from 'assert';
import klawSync from 'klaw-sync';

/* global afterEach, beforeEach, describe, it */

let TEST_DIR = '';

const FILES = [
  path.join('dir1', 'file1.txt'),
  path.join('dir1', 'dir2', 'file2.txt'),
  path.join('dir1', 'dir2', 'dir3', 'file3.txt'),
];

describe('+ copy() - copy a readonly directory with content', () => {
  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'test', 'fs-extra', 'copy-readonly-dir');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(done => {
    klawSync(TEST_DIR).forEach(data => fs.chmodSync(data.path, 0o777));
    fse
      .remove(TEST_DIR)
      .catch(err => err)
      .then(done);
  });

  describe('> when src is readonly directory with content', () => {
    it('should copy successfully', done => {
      FILES.forEach(file => {
        fs.outputFileSync(path.join(TEST_DIR, file), file);
      });

      const sourceDir = path.join(TEST_DIR, 'dir1');
      const sourceHierarchy = klawSync(sourceDir);
      sourceHierarchy.forEach(source =>
        fs.chmodSync(source.path, source.stats.isDirectory() ? 0o555 : 0o444),
      );

      const targetDir = path.join(TEST_DIR, 'target');
      fse
        .copy(sourceDir, targetDir)
        .catch(err => err)
        .then(err => {
          assert.ifError(err);

          // Make sure copy was made and mode was preserved
          assert(fs.existsSync(targetDir));
          const targetHierarchy = klawSync(targetDir);
          assert(targetHierarchy.length === sourceHierarchy.length);
          targetHierarchy.forEach(target =>
            assert(
              target.stats.mode === target.stats.isDirectory() ? 0o555 : 0o444,
            ),
          );
          done();
        });
    });
  });
});

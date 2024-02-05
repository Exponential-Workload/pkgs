'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../../';
import path from 'path';

/* global afterEach, beforeEach, describe, it */

let TEST_DIR = '';

describe('+ copy() - copy /dev/null', () => {
  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy-dev-null');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('> when src is /dev/null', () => {
    it('should copy successfully', async () => {
      // no /dev/null on windows
      if (process.platform === 'win32') return;

      const tmpFile = path.join(TEST_DIR, 'foo');

      await fse.copy('/dev/null', tmpFile);
      const stats = fs.lstatSync(tmpFile);
      expect(stats.size).toStrictEqual(0);
    });
  });
});

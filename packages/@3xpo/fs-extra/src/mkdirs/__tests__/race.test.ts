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

  it('race', async () => {
    const mk = async (file: string) => {
      await fse.mkdirp(file, 493);
      const ex = await fse.pathExists(file);
      expect(ex).toBeTruthy();
      const stat = fs.statSync(file);

      if (os.platform().indexOf('win') === 0) {
        expect(stat.mode & 511).toStrictEqual(438);
      } else {
        expect(stat.mode & 511).toStrictEqual(493);
      }

      expect(stat.isDirectory()).toBeTruthy();
    };

    await Promise.all([mk(file), mk(file)]);
  });
});

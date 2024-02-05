'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('jsonfile-integration', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'json');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ writeJsonSync / spaces', () => {
    it('should read a file and parse the json', () => {
      const obj1 = {
        firstName: 'JP',
        lastName: 'Richardson',
      };

      const file = path.join(TEST_DIR, 'file.json');
      fse.writeJsonSync(file, obj1);
      const data = fs.readFileSync(file, 'utf8');
      expect(data).toBe(JSON.stringify(obj1) + '\n');
    });
  });

  describe('+ writeJsonSync / EOL', () => {
    it('should read a file and parse the json', () => {
      const obj1 = {
        firstName: 'JP',
        lastName: 'Richardson',
      };

      const file = path.join(TEST_DIR, 'file.json');
      fse.writeJsonSync(file, obj1, { spaces: 2, EOL: '\r\n' });
      const data = fs.readFileSync(file, 'utf8');
      expect(data).toBe(JSON.stringify(obj1, null, 2).replace(/\n/g, '\r\n') + '\r\n');
    });
  });
});

'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';

/* global afterEach, beforeEach, describe, it */

describe('read', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'read-json');
    return fse.emptyDir(TEST_DIR);
  });

  afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

  describe('+ readJSON', () => {
    it('should read a file and parse the json', done => {
      const obj1 = {
        firstName: 'JP',
        lastName: 'Richardson',
      };

      const file = path.join(TEST_DIR, 'file.json');
      fs.writeFileSync(file, JSON.stringify(obj1));
      fse
        .readJSON(file)
        .catch(err => expect(err).toBeFalsy() as never)
        .then(obj2 => {
          expect(obj1.firstName).toBe(obj2.firstName);
          expect(obj1.lastName).toBe(obj2.lastName);
          done();
        });
    });

    it('should error if it cant parse the json', done => {
      const file = path.join(TEST_DIR, 'file2.json');
      fs.writeFileSync(file, '%asdfasdff444');
      fse.readJSON(file, undefined, (err, obj) => {
        expect(err).toBeTruthy();
        expect(!obj).toBeTruthy();
        done();
      });
    });
  });
});

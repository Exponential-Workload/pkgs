'use strict';

import assert from 'assert';
import fse from '../..';

/* global describe, it */

describe('mkdirp: issue-209, win32, when bad path, should return a cleaner error', () => {
  // only seems to be an issue on Windows.
  if (process.platform !== 'win32')
    return test('skip on non-windows', () => expect(true).toEqual(true));

  it('should return a callback', done => {
    const file = './bad?dir';
    fse
      .mkdirp(file)
      .catch(err => err)
      .then(err => {
        expect(err).toBeTruthy();
        expect(err.code).toBe('EINVAL');

        const file2 = 'c:\\tmp\foo:moo';
        fse
          .mkdirp(file2)
          .catch(err => err)
          .then(err => {
            expect(err).toBeTruthy();
            expect(err.code).toBe('EINVAL');
            done();
          });
      });
  });

  describe('> sync', () => {
    it('should throw an error', () => {
      let didErr;
      try {
        const file = 'c:\\tmp\foo:moo';
        fse.mkdirpSync(file);
      } catch {
        didErr = true;
      }
      expect(didErr).toBeTruthy();
    });
  });
});

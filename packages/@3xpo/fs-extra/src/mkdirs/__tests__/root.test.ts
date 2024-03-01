'use strict';

import * as fs from 'fs';
import fse from '../..';
import path from 'path';

/* global describe, it */

describe('mkdirp / root', () => {
  // '/' on unix
  const dir = path.normalize(path.resolve(path.sep)).toLowerCase();

  // Windows does not have permission to mkdir on root
  if (process.platform === 'win32')
    return it.skip('Windows does not have permission to mkdir on root', () =>
      void 0);

  it('should', done => {
    fse
      .mkdirp(dir, 0o755)
      .catch(err => err)
      .then(err => {
        if (err) return done(err);
        fs.stat(dir, (er, stat) => {
          if (er) return done(er);
          expect(stat.isDirectory()).toBeTruthy();
          done();
        });
      });
  });
});

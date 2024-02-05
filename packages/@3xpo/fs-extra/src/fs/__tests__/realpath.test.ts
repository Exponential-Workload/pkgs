'use strict';

import assert from 'assert';
import fse from '../..';

/* eslint-env mocha */

describe('realpath.native', () => {
  it('works with callbacks', () => {
    fse.realpath.native(__dirname, (err, path) => {
      expect(err).toBeFalsy();
      expect(path).toBe(__dirname);
    });
  });

  it('works with promises', done => {
    fse.realpath
      .native(__dirname)
      .then(path => {
        expect(path).toBe(__dirname);
        done();
      })
      .catch(done);
  });

  it('works with sync version', () => {
    const path = fse.realpathSync.native(__dirname);
    expect(path).toBe(__dirname);
  });
});

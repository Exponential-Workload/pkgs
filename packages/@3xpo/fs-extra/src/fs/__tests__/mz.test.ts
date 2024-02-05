'use strict';
// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors

/* eslint-env mocha */
import assert from 'assert';
import fs from '../..';

describe('fs', () => {
  it('.stat()', done => {
    fs.stat(__filename)
      .then(stats => {
        expect(typeof stats.size).toBe('number');
        done();
      })
      .catch(done);
  });

  it('.statSync()', () => {
    const stats = fs.statSync(__filename);
    expect(typeof stats.size).toBe('number');
  });

  it('.exists()', done => {
    fs.exists(__filename)
      .then(exists => {
        expect(exists).toBeTruthy();
        done();
      })
      .catch(done);
  });

  it('.existsSync()', () => {
    const exists = fs.existsSync(__filename);
    expect(exists).toBeTruthy();
  });

  describe('callback support', () => {
    it('.stat()', done => {
      fs.stat(__filename, (err, stats) => {
        expect(!err).toBeTruthy();
        expect(typeof stats.size).toBe('number');
        done();
      });
    });

    // This test is different from mz/fs, since we are a drop-in replacement for native fs
    it('.exists()', done => {
      fs.exists(__filename, exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });
  });
});

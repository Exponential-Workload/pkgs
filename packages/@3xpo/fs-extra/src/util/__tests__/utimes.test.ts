'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import utimes from '../utimes';

/* global beforeEach, describe, it */

// HFS, ext{2,3}, FAT do not
function hasMillisResSync() {
  let tmpfile = path.join(
    'millis-test-sync' +
      Date.now().toString() +
      Math.random().toString().slice(2),
  );
  tmpfile = path.join(os.tmpdir(), tmpfile);

  // 550 millis past UNIX epoch
  const d = new Date(1435410243862);
  fs.writeFileSync(
    tmpfile,
    'https://github.com/jprichardson/node-fs-extra/pull/141',
  );
  const fd = fs.openSync(tmpfile, 'r+');
  fs.futimesSync(fd, d, d);
  fs.closeSync(fd);
  return fs.statSync(tmpfile).mtime.getTime() > 1435410243000;
}

describe('utimes', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'utimes');
    await fse.emptyDir(TEST_DIR);
  });

  describe('utimesMillis()', () => {
    // see discussion https://github.com/jprichardson/node-fs-extra/pull/141
    it('should set the utimes w/ millisecond precision', () => {
      const tmpFile = path.join(TEST_DIR, 'someFile');
      fs.writeFileSync(tmpFile, 'hello');

      let stats = fs.lstatSync(tmpFile);

      // Apr 21st, 2012
      const awhileAgo = new Date(1334990868773);
      const awhileAgoNoMillis = new Date(1334990868000);

      expect(stats.mtime.getTime()).not.toStrictEqual(awhileAgo.getTime());
      expect(stats.atime.getTime()).not.toStrictEqual(awhileAgo.getTime());

      return utimes.utimesMillis(tmpFile, awhileAgo, awhileAgo).then(() => {
        stats = fs.statSync(tmpFile);
        if (hasMillisResSync()) {
          expect(stats.mtime.getTime()).toStrictEqual(awhileAgo.getTime());
          expect(stats.atime.getTime()).toStrictEqual(awhileAgo.getTime());
        } else {
          expect(stats.mtime.getTime()).toStrictEqual(awhileAgoNoMillis.getTime());
          expect(stats.atime.getTime()).toStrictEqual(awhileAgoNoMillis.getTime());
        }
      });
    }, 10000);

    // TODO: atm i dont care, will fix later:
    // it('should close open file desciptors after encountering an error', done => {
    //   const fakeFd = Math.random();

    //   gracefulFsStub.open = fromCallback(
    //     (pathIgnored, flagsIgnored, modeIgnored, callback) => {
    //       if (typeof modeIgnored === 'function') callback = modeIgnored;
    //       process.nextTick(() => callback(null, fakeFd));
    //     },
    //   );

    //   let closeCalled = false;
    //   gracefulFsStub.close = fromCallback((fd, callback) => {
    //     assert.strictEqual(fd, fakeFd);
    //     closeCalled = true;
    //     if (callback) process.nextTick(callback);
    //   });

    //   let testError;
    //   gracefulFsStub.futimes = fromCallback(
    //     (fd, atimeIgnored, mtimeIgnored, callback) => {
    //       process.nextTick(() => {
    //         testError = new Error('A test error');
    //         callback(testError);
    //       });
    //     },
    //   );

    //   utimes.utimesMillis('ignored', 'ignored', 'ignored', err => {
    //     assert.strictEqual(err, testError);
    //     assert(closeCalled);
    //     done();
    //   });
    // });
  });
});

'use strict';

import * as fs from 'fs';
import { copy as ncp } from '../../';
import path from 'path';
import { rimraf } from 'rimraf';
import assert from 'assert';
import { read as readDirFiles } from 'read-dir-files'; // temporary, will remove

/* eslint-env mocha */

const fixturesDir = path.join(__dirname, 'fixtures');

describe('ncp', () => {
  describe('regular files and directories', () => {
    const fixtures = path.join(fixturesDir, 'regular-fixtures');
    const src = path.join(fixtures, 'src');
    const out = path.join(fixtures, 'out');

    beforeAll(cb => rimraf(out, (() => ncp(src, out, cb)) as any));

    describe('when copying a directory of files', () => {
      it('files are copied correctly', cb => {
        readDirFiles(src, 'utf8', (srcErr, srcFiles) => {
          readDirFiles(out, 'utf8', (outErr, outFiles) => {
            assert.ifError(srcErr);
            assert.deepStrictEqual(srcFiles, outFiles);
            cb();
          });
        });
      });
    });

    describe('when copying files using filter', () => {
      beforeAll(cb => {
        const filter = name => name.slice(-1) !== 'a';

        rimraf(out, (() =>
          ncp(src, out, { filter })
            .catch(err => err)
            .then(err => cb)) as any);
      });

      it('files are copied correctly', cb => {
        readDirFiles(src, 'utf8', (srcErr, srcFiles) => {
          function filter(files) {
            for (const fileName in files) {
              const curFile = files[fileName];
              if (curFile instanceof Object) {
                filter(curFile);
              } else if (fileName.slice(-1) === 'a') {
                delete files[fileName];
              }
            }
          }
          filter(srcFiles);
          readDirFiles(out, 'utf8', (outErr, outFiles) => {
            assert.ifError(outErr);
            assert.deepStrictEqual(srcFiles, outFiles);
            cb();
          });
        });
      });
    });

    describe('when using overwrite=true', () => {
      beforeAll(function () {
        this.originalCreateReadStream = fs.createReadStream;
      });

      afterAll(function () {
        (fs as any).createReadStream = this.originalCreateReadStream;
      });

      it('the copy is complete after callback', done => {
        ncp(src, out, { overwrite: true })
          .catch(err => err)
          .then(err => {
            (fs as any).createReadStream = () =>
              done(new Error('createReadStream after callback'));

            assert.ifError(err);
            process.nextTick(done);
          });
      });
    });

    describe('when using overwrite=false', () => {
      beforeEach(done =>
        rimraf(out)
          .catch(err => err)
          .then(done),
      );

      it('works', cb => {
        ncp(src, out, { overwrite: false })
          .catch(err => err)
          .then(err => {
            assert.ifError(err);
            cb();
          });
      });

      it('should not error if files exist', cb => {
        ncp(src, out, () => {
          ncp(src, out, { overwrite: false })
            .catch(err => err)
            .then(err => {
              assert.ifError(err);
              cb();
            });
        });
      });

      it('should error if errorOnExist and file exists', cb => {
        ncp(src, out, () => {
          ncp(src, out, {
            overwrite: false,
            errorOnExist: true,
          })
            .catch(err => err)
            .then(err => err => {
              assert(err);
              cb();
            });
        });
      });
    });

    describe('clobber', () => {
      beforeEach(done =>
        rimraf(out)
          .catch(err => err)
          .then(done),
      );

      it('is an alias for overwrite', cb => {
        ncp(src, out, () => {
          ncp(src, out, {
            clobber: false,
            errorOnExist: true,
          })
            .catch(err => err)
            .then(err => err => {
              assert(err);
              cb();
            });
        });
      });
    });

    describe('when using transform', () => {
      it('file descriptors are passed correctly', cb => {
        ncp(src, out, {
          transform: (read, write, file) => {
            assert.notStrictEqual(file.name, undefined);
            assert.strictEqual(typeof file.mode, 'number');
            read.pipe(write);
          },
        })
          .catch(err => err)
          .then(err => cb);
      });
    });
  });

  // see https://github.com/AvianFlu/ncp/issues/71
  describe('Issue 71: Odd Async Behaviors', () => {
    const fixtures = path.join(__dirname, 'fixtures', 'regular-fixtures');
    const src = path.join(fixtures, 'src');
    const out = path.join(fixtures, 'out');

    let totalCallbacks = 0;

    function copyAssertAndCount(callback) {
      // rimraf(out, function() {
      ncp(src, out)
        .catch(err => err)
        .then(err => {
          assert(!err);
          totalCallbacks += 1;
          readDirFiles(src, 'utf8', (srcErr, srcFiles) => {
            readDirFiles(out, 'utf8', (outErr, outFiles) => {
              assert.ifError(srcErr);
              assert.deepStrictEqual(srcFiles, outFiles);
              callback();
            });
          });
        });
      // })
    }

    describe('when copying a directory of files without cleaning the destination', () => {
      it('callback fires once per run and directories are equal', done => {
        const expected = 10;
        let count = 10;

        function next() {
          if (count > 0) {
            setTimeout(() => {
              copyAssertAndCount(() => {
                count -= 1;
                next();
              });
            }, 100);
          } else {
            // console.log('Total callback count is', totalCallbacks)
            assert.strictEqual(totalCallbacks, expected);
            done();
          }
        }

        next();
      });
    });
  });
});

'use strict';

const CWD = process.cwd();

import fs from 'graceful-fs';
import * as os from 'os';
import fse from '../..';
import path from 'path';
import assert from 'assert';
import { fromCallback } from '@3xpo/universalify';
const ensureLink = fse.ensureLink;
const ensureLinkSync = fse.ensureLinkSync;

/* global afterEach, beforeEach, describe, it, after, before */

describe('fse-ensure-link', () => {
  const TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'ensure-symlink');

  const tests = [
    // [[srcpath, dstpath], fs.link expect, ensureLink expect]
    [['./foo.txt', './link.txt'], 'file-success', 'file-success'],
    [['./foo.txt', './dir-foo/link.txt'], 'file-success', 'file-success'],
    [['./foo.txt', './empty-dir/link.txt'], 'file-success', 'file-success'],
    [['./foo.txt', './real-alpha/link.txt'], 'file-success', 'file-success'],
    [
      ['./foo.txt', './real-alpha/real-beta/link.txt'],
      'file-success',
      'file-success',
    ],
    [
      ['./foo.txt', './real-alpha/real-beta/real-gamma/link.txt'],
      'file-success',
      'file-success',
    ],
    [['./foo.txt', './alpha/link.txt'], 'file-error', 'file-success'],
    [['./foo.txt', './alpha/beta/link.txt'], 'file-error', 'file-success'],
    [
      ['./foo.txt', './alpha/beta/gamma/link.txt'],
      'file-error',
      'file-success',
    ],
    [['./foo.txt', './link-foo.txt'], 'file-error', 'file-success'],
    [['./dir-foo/foo.txt', './link-foo.txt'], 'file-error', 'file-error'],
    [['./missing.txt', './link.txt'], 'file-error', 'file-error'],
    [['./missing.txt', './missing-dir/link.txt'], 'file-error', 'file-error'],
    [['./foo.txt', './link.txt'], 'file-success', 'file-success'],
    [['./dir-foo/foo.txt', './link.txt'], 'file-success', 'file-success'],
    [['./missing.txt', './link.txt'], 'file-error', 'file-error'],
    [['../foo.txt', './link.txt'], 'file-error', 'file-error'],
    [['../dir-foo/foo.txt', './link.txt'], 'file-error', 'file-error'],
    // error is thrown if destination path exists
    [['./foo.txt', './dir-foo/foo.txt'], 'file-error', 'file-error'],
    [
      [path.resolve(path.join(TEST_DIR, './foo.txt')), './link.txt'],
      'file-success',
      'file-success',
    ],
    [
      [path.resolve(path.join(TEST_DIR, './dir-foo/foo.txt')), './link.txt'],
      'file-success',
      'file-success',
    ],
    [
      [path.resolve(path.join(TEST_DIR, './missing.txt')), './link.txt'],
      'file-error',
      'file-error',
    ],
    [
      [path.resolve(path.join(TEST_DIR, '../foo.txt')), './link.txt'],
      'file-error',
      'file-error',
    ],
    [
      [path.resolve(path.join(TEST_DIR, '../dir-foo/foo.txt')), './link.txt'],
      'file-error',
      'file-error',
    ],
  ];

  beforeEach(async () => {
    fs.mkdirSync(TEST_DIR, {
      recursive: true,
    });
    process.chdir(TEST_DIR);
    fs.writeFileSync('./foo.txt', 'foo\n');
    fse.mkdirsSync('empty-dir');
    fse.mkdirsSync('dir-foo');
    fs.writeFileSync('dir-foo/foo.txt', 'dir-foo\n');
    fse.mkdirsSync('dir-bar');
    fs.writeFileSync('dir-bar/bar.txt', 'dir-bar\n');
    fse.mkdirsSync('real-alpha/real-beta/real-gamma');
    fs.linkSync('foo.txt', 'link-foo.txt');
  });

  afterEach(() => {
    process.chdir(CWD);
    fse.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  function fileSuccess(args, fn) {
    const srcpath = args[0];
    const dstpath = args[1];

    it(`should create link file using src ${srcpath} and dst ${dstpath}`, () => {
      const callback = () => {
        const srcContent = fs.readFileSync(srcpath, 'utf8');
        const dstDir = path.dirname(dstpath);
        const dstBasename = path.basename(dstpath);
        const isSymlink = fs.lstatSync(dstpath).isFile();
        const dstContent = fs.readFileSync(dstpath, 'utf8');
        const dstDirContents = fs.readdirSync(dstDir);

        expect(isSymlink).toBe(true);
        expect(srcContent).toBe(dstContent);
        expect(dstDirContents.indexOf(dstBasename) >= 0).toBeTruthy();
        return;
      };
      return fn(...args).then(callback);
    });
  }

  function fileError(args, fn) {
    const srcpath = args[0];
    const dstpath = args[1];

    it(`should return error when creating link file using src ${srcpath} and dst ${dstpath}`, () => {
      const dstdirExistsBefore = fs.existsSync(path.dirname(dstpath));
      const callback = err => {
        expect(err).toBeTruthy();
        // ensure that directories aren't created if there's an error
        const dstdirExistsAfter = fs.existsSync(path.dirname(dstpath));
        expect(dstdirExistsBefore).toStrictEqual(dstdirExistsAfter);
      };
      return fn(...args)
        .then(() => {
          expect(false).toEqual(true);
        })
        .catch(callback);
    });
  }

  function fileSuccessSync(args, fn) {
    const srcpath = args[0];
    const dstpath = args[1];

    it(`should create link file using src ${srcpath} and dst ${dstpath}`, () => {
      fn(...args);
      const srcContent = fs.readFileSync(srcpath, 'utf8');
      const dstDir = path.dirname(dstpath);
      const dstBasename = path.basename(dstpath);
      const isSymlink = fs.lstatSync(dstpath).isFile();
      const dstContent = fs.readFileSync(dstpath, 'utf8');
      const dstDirContents = fs.readdirSync(dstDir);
      expect(isSymlink).toBe(true);
      expect(srcContent).toBe(dstContent);
      expect(dstDirContents.indexOf(dstBasename) >= 0).toBeTruthy();
    });
  }

  function fileErrorSync(args, fn) {
    const srcpath = args[0];
    const dstpath = args[1];

    it(`should throw error using src ${srcpath} and dst ${dstpath}`, () => {
      // will fail if dstdir is created and there's an error
      const dstdirExistsBefore = fs.existsSync(path.dirname(dstpath));
      let err = null as any;
      try {
        fn(...args);
      } catch (e) {
        err = e;
      }
      expect(err).toBeTruthy();
      const dstdirExistsAfter = fs.existsSync(path.dirname(dstpath));
      expect(dstdirExistsBefore).toBe(dstdirExistsAfter);
    });
  }

  describe('fs.link()', () => {
    const fn = fs.link;
    tests.forEach(test => {
      const args = test[0].slice(0);
      const nativeBehavior = test[1];
      // const newBehavior = test[2]
      if (nativeBehavior === 'file-success')
        fileSuccess(args, fromCallback(fn));
      if (nativeBehavior === 'file-error') fileError(args, fromCallback(fn));
    });
  });

  describe('ensureLink()', () => {
    const fn = ensureLink;
    tests.forEach(test => {
      const args = test[0].slice(0);
      // const nativeBehavior = test[1]
      const newBehavior = test[2];
      if (newBehavior === 'file-success') fileSuccess(args, fn);
      if (newBehavior === 'file-error') fileError(args, fn);
    });
  });

  describe('ensureLink() promise support', () => {
    tests
      .filter(test => test[2] === 'file-success')
      .forEach(test => {
        const args = test[0].slice(0);
        const srcpath = args[0];
        const dstpath = args[1];

        it(`should create link file using src ${srcpath} and dst ${dstpath}`, () => {
          return ensureLink(srcpath, dstpath).then(() => {
            const srcContent = fs.readFileSync(srcpath, 'utf8');
            const dstDir = path.dirname(dstpath);
            const dstBasename = path.basename(dstpath);
            const isSymlink = fs.lstatSync(dstpath).isFile();
            const dstContent = fs.readFileSync(dstpath, 'utf8');
            const dstDirContents = fs.readdirSync(dstDir);

            expect(isSymlink).toBe(true);
            expect(srcContent).toBe(dstContent);
            expect(dstDirContents.indexOf(dstBasename) >= 0).toBeTruthy();
          });
        });
      });
  });

  describe('fs.linkSync()', () => {
    const fn = fs.linkSync;
    tests.forEach(test => {
      const args = test[0].slice(0);
      const nativeBehavior = test[1];
      // const newBehavior = test[2]
      if (nativeBehavior === 'file-success') fileSuccessSync(args, fn);
      if (nativeBehavior === 'file-error') fileErrorSync(args, fn);
    });
  });

  describe('ensureLinkSync()', () => {
    const fn = ensureLinkSync;
    tests.forEach(test => {
      const args = test[0].slice(0);
      // const nativeBehavior = test[1]
      const newBehavior = test[2];
      if (newBehavior === 'file-success') fileSuccessSync(args, fn);
      if (newBehavior === 'file-error') fileErrorSync(args, fn);
    });
  });
});

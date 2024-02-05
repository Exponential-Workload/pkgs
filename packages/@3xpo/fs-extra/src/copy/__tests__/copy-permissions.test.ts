'use strict';

import * as fs from 'fs';
import * as os from 'os';
import fse from '../../';
import path from 'path';

/* global beforeEach, describe, it */

describe('copy', () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = path.join(os.tmpdir(), 'fs-extra-test-suite', 'copy');
    return fse.emptyDir(TEST_DIR);
  });

  // pretty UNIX specific, may not pass on windows... only tested on Mac OS X 10.9
  it('should maintain file permissions and ownership', async () => {
    if (process.platform === 'win32') return;

    // const userid = require('userid')

    // http://man7.org/linux/man-pages/man2/stat.2.html
    const S_IFREG = 0o100000; // regular file
    const S_IFDIR = 0o40000; // directory

    // these are Mac specific I think (at least staff), should find Linux equivalent
    let gidWheel: number;
    let gidStaff: number;

    if (!process.getgid || !process.getuid)
      throw new Error('cannot getuid/getgid!');

    try {
      gidWheel = process.getgid(); // userid.gid('wheel')
    } catch {
      gidWheel = process.getgid();
    }

    try {
      gidStaff = process.getgid(); // userid.gid('staff')
    } catch {
      gidStaff = process.getgid();
    }

    const permDir = path.join(TEST_DIR, 'perms');
    fs.mkdirSync(permDir);

    const srcDir = path.join(permDir, 'src');
    fs.mkdirSync(srcDir);

    const f1 = path.join(srcDir, 'f1.txt');
    fs.writeFileSync(f1, '');
    fs.chmodSync(f1, 0o666);
    fs.chownSync(f1, process.getuid(), gidWheel);
    const f1stats = fs.lstatSync(f1);
    expect(f1stats.mode - S_IFREG).toStrictEqual(0o666);

    const d1 = path.join(srcDir, 'somedir');
    fs.mkdirSync(d1);
    fs.chmodSync(d1, 0o777);
    fs.chownSync(d1, process.getuid(), gidStaff);
    const d1stats = fs.lstatSync(d1);
    expect(d1stats.mode - S_IFDIR).toStrictEqual(0o777);

    const f2 = path.join(d1, 'f2.bin');
    fs.writeFileSync(f2, '');
    fs.chmodSync(f2, 0o777);
    fs.chownSync(f2, process.getuid(), gidStaff);
    const f2stats = fs.lstatSync(f2);
    expect(f2stats.mode - S_IFREG).toStrictEqual(0o777);

    const d2 = path.join(srcDir, 'crazydir');
    fs.mkdirSync(d2);
    fs.chmodSync(d2, 0o444);
    fs.chownSync(d2, process.getuid(), gidWheel);
    const d2stats = fs.lstatSync(d2);
    expect(d2stats.mode - S_IFDIR).toStrictEqual(0o444);

    const destDir = path.join(permDir, 'dest');
    await fse.copy(srcDir, destDir);

    const newf1stats = fs.lstatSync(path.join(permDir, 'dest/f1.txt'));
    const newd1stats = fs.lstatSync(path.join(permDir, 'dest/somedir'));
    const newf2stats = fs.lstatSync(path.join(permDir, 'dest/somedir/f2.bin'));
    const newd2stats = fs.lstatSync(path.join(permDir, 'dest/crazydir'));

    expect(newf1stats.mode).toStrictEqual(f1stats.mode);
    expect(newd1stats.mode).toStrictEqual(d1stats.mode);
    expect(newf2stats.mode).toStrictEqual(f2stats.mode);
    expect(newd2stats.mode).toStrictEqual(d2stats.mode);

    expect(newf1stats.gid).toStrictEqual(f1stats.gid);
    expect(newd1stats.gid).toStrictEqual(d1stats.gid);
    expect(newf2stats.gid).toStrictEqual(f2stats.gid);
    expect(newd2stats.gid).toStrictEqual(d2stats.gid);

    expect(newf1stats.uid).toStrictEqual(f1stats.uid);
    expect(newd1stats.uid).toStrictEqual(d1stats.uid);
    expect(newf2stats.uid).toStrictEqual(f2stats.uid);
    expect(newd2stats.uid).toStrictEqual(d2stats.uid);
  });
});

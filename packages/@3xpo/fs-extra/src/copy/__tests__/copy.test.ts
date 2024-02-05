// 'use strict';

// import * as fs from 'fs';
// import * as os from 'os';
// import fse from '../..';
// import path from 'path';
// import crypto from 'crypto';

// /* global afterEach, beforeEach, describe, it */

// const SIZE = 16 * 64 * 1024 + 7;
// let TEST_DIR = '';

// describe('@3xpo/fs-extra -> copy', () => {
//   beforeEach(() => {
//     TEST_DIR = path.join(os.tmpdir(), 'fs-extra', 'copy');
//     return fse.emptyDir(TEST_DIR);
//   });

//   afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

//   describe('+ copy()', () => {
//     it('should return an error if src and dest are the same', done => {
//       const fileSrc = path.join(TEST_DIR, 'TEST_fs-extra_copy');
//       const fileDest = path.join(TEST_DIR, 'TEST_fs-extra_copy');
//       fse.ensureFileSync(fileSrc);

//       fse
//         .copy(fileSrc, fileDest)
//         .catch(err => err)
//         .then(err => {
//           expect(err.message).toBe('Source and destination must not be the same.');
//           done();
//         });
//     });

//     it('should error when overwrite=false and file exists', done => {
//       const src = path.join(TEST_DIR, 'src.txt');
//       const dest = path.join(TEST_DIR, 'dest.txt');

//       fse.ensureFileSync(src);
//       fse.ensureFileSync(dest);
//       fse
//         .copy(src, dest, { overwrite: false, errorOnExist: true })
//         .catch(err => err)
//         .then(err => {
//           expect(err).toBeTruthy();
//           done();
//         });
//     });

//     it('should error when overwrite=false and file exists in a dir', done => {
//       const src = path.join(TEST_DIR, 'src', 'sfile.txt');
//       const dest = path.join(TEST_DIR, 'dest', 'dfile.txt');

//       fse.ensureFileSync(src);
//       fse.ensureFileSync(dest);
//       fse
//         .copy(src, dest, { overwrite: false, errorOnExist: true })
//         .catch(err => err)
//         .then(err => {
//           expect(err).toBeTruthy();
//           done();
//         });
//     });

//     describe('> when src is a file', () => {
//       it('should copy the file asynchronously', done => {
//         const fileSrc = path.join(TEST_DIR, 'TEST_fs-extra_src');
//         const fileDest = path.join(TEST_DIR, 'TEST_fs-extra_copy');
//         fs.writeFileSync(fileSrc, crypto.randomBytes(SIZE));
//         const srcMd5 = crypto
//           .createHash('md5')
//           .update(fs.readFileSync(fileSrc))
//           .digest('hex');
//         let destMd5 = '';

//         fse
//           .copy(fileSrc, fileDest)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             destMd5 = crypto
//               .createHash('md5')
//               .update(fs.readFileSync(fileDest))
//               .digest('hex');
//             expect(srcMd5).toBe(destMd5);
//             done();
//           });
//       });

//       it('should work with promises', async () => {
//         const fileSrc = path.join(TEST_DIR, 'TEST_fs-extra_src');
//         const fileDest = path.join(TEST_DIR, 'TEST_fs-extra_copy');
//         fs.writeFileSync(fileSrc, crypto.randomBytes(SIZE));
//         const srcMd5 = crypto
//           .createHash('md5')
//           .update(fs.readFileSync(fileSrc))
//           .digest('hex');
//         let destMd5 = '';

//         await fse.copy(fileSrc, fileDest);
//         destMd5 = crypto
//           .createHash('md5')
//           .update(fs.readFileSync(fileDest))
//           .digest('hex');
//         expect(srcMd5).toBe(destMd5);
//       });

//       it('should return an error if src file does not exist', done => {
//         const fileSrc = 'we-simply-assume-this-file-does-not-exist.bin';
//         const fileDest = path.join(TEST_DIR, 'TEST_fs-extra_copy');

//         fse
//           .copy(fileSrc, fileDest)
//           .catch(err => err)
//           .then(err => {
//             expect(err).toBeTruthy();
//             done();
//           });
//       });

//       it("should copy to a destination file with two '$' characters in name (eg: TEST_fs-extra_$$_copy)", done => {
//         const fileSrc = path.join(TEST_DIR, 'TEST_fs-extra_src');
//         const fileDest = path.join(TEST_DIR, 'TEST_fs-extra_$$_copy');

//         fs.writeFileSync(fileSrc, '');

//         fse
//           .copy(fileSrc, fileDest)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             fs.statSync(fileDest);
//             done();
//           });
//       });

//       describe('> when the destination dir does not exist', () => {
//         it('should create the destination directory and copy the file', done => {
//           const src = path.join(TEST_DIR, 'file.txt');
//           const dest = path.join(
//             TEST_DIR,
//             'this/path/does/not/exist/copied.txt',
//           );
//           const data = 'did it copy?\n';

//           fs.writeFileSync(src, data, 'utf8');

//           fse
//             .copy(src, dest)
//             .catch(err => err)
//             .then(err => {
//               const data2 = fs.readFileSync(dest, 'utf8');
//               expect(data).toBe(data2);
//               done(err);
//             });
//         });
//       });

//       describe('> when dest exists and is a directory', () => {
//         it('should return an error', done => {
//           const src = path.join(TEST_DIR, 'file.txt');
//           const dest = path.join(TEST_DIR, 'dir');
//           fse.ensureFileSync(src);
//           fse.ensureDirSync(dest);

//           fse
//             .copy(src, dest)
//             .catch(err => err)
//             .then(err => {
//               expect(err.message).toBe(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
//               done();
//             });
//         });
//       });
//     });

//     describe('> when src is a directory', () => {
//       describe('> when src directory does not exist', () => {
//         it('should return an error', done => {
//           const ts = path.join(TEST_DIR, 'this_dir_does_not_exist');
//           const td = path.join(TEST_DIR, 'this_dir_really_does_not_matter');
//           fse
//             .copy(ts, td)
//             .catch(err => err)
//             .then(err => {
//               expect(err).toBeTruthy();
//               done();
//             });
//         });
//       });

//       describe('> when dest exists and is a file', () => {
//         it('should return an error', done => {
//           const src = path.join(TEST_DIR, 'src');
//           const dest = path.join(TEST_DIR, 'file.txt');
//           fs.mkdirSync(src);
//           fse.ensureFileSync(dest);

//           fse
//             .copy(src, dest)
//             .catch(err => err)
//             .then(err => {
//               expect(err.message).toBe(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
//               done();
//             });
//         });
//       });

//       it('should preserve symbolic links', done => {
//         const src = path.join(TEST_DIR, 'src');
//         const dest = path.join(TEST_DIR, 'dest');
//         const srcTarget = path.join(TEST_DIR, 'destination');
//         fse.mkdirSync(src);
//         fse.mkdirSync(srcTarget);
//         // symlink type is only used for Windows and the default is 'file'.
//         // https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback
//         fse.symlinkSync(srcTarget, path.join(src, 'symlink'), 'dir');

//         fse
//           .copy(src, dest)
//           .catch(err => err)
//           .then(err => {
//             expect(err).toBeFalsy();
//             const link = fs.readlinkSync(path.join(dest, 'symlink'));
//             expect(link).toBe(srcTarget);
//             done();
//           });
//       });

//       it('should copy the directory asynchronously', done => {
//         const FILES = 2;
//         const src = path.join(TEST_DIR, 'src');
//         const dest = path.join(TEST_DIR, 'dest');

//         fse
//           .mkdirs(src)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             for (let i = 0; i < FILES; ++i) {
//               fs.writeFileSync(
//                 path.join(src, i.toString()),
//                 crypto.randomBytes(SIZE),
//               );
//             }

//             const subdir = path.join(src, 'subdir');
//             fse
//               .mkdirs(subdir)
//               .catch(err => err)
//               .then(err => {
//                 expect(!err).toBeTruthy();
//                 for (let i = 0; i < FILES; ++i) {
//                   fs.writeFileSync(
//                     path.join(subdir, i.toString()),
//                     crypto.randomBytes(SIZE),
//                   );
//                 }

//                 fse
//                   .copy(src, dest)
//                   .catch(err => err)
//                   .then(err => {
//                     expect(err).toBeFalsy();
//                     expect(fs.existsSync(dest)).toBeTruthy();

//                     for (let i = 0; i < FILES; ++i) {
//                       expect(fs.existsSync(path.join(dest, i.toString()))).toBeTruthy();
//                     }

//                     const destSub = path.join(dest, 'subdir');
//                     for (let j = 0; j < FILES; ++j) {
//                       expect(fs.existsSync(path.join(destSub, j.toString()))).toBeTruthy();
//                     }

//                     done();
//                   });
//               });
//           });
//       });

//       describe('> when the destination dir does not exist', () => {
//         it('should create the destination directory and copy the file', done => {
//           const src = path.join(TEST_DIR, 'data/');
//           fse.mkdirsSync(src);
//           const d1 = 'file1';
//           const d2 = 'file2';

//           fs.writeFileSync(path.join(src, 'f1.txt'), d1);
//           fs.writeFileSync(path.join(src, 'f2.txt'), d2);

//           const dest = path.join(
//             TEST_DIR,
//             'this/path/does/not/exist/outputDir',
//           );

//           fse
//             .copy(src, dest)
//             .catch(err => err)
//             .then(err => {
//               const o1 = fs.readFileSync(path.join(dest, 'f1.txt'), 'utf8');
//               const o2 = fs.readFileSync(path.join(dest, 'f2.txt'), 'utf8');

//               expect(d1).toBe(o1);
//               expect(d2).toBe(o2);

//               done(err);
//             });
//         });
//       });

//       describe('> when src dir does not exist', () => {
//         it('should return an error', () =>
//           fse.copy('/does/not/exist', '/something/else'));
//       });
//     });

//     describe('> when filter is used', () => {
//       it('should do nothing if filter fails', done => {
//         const srcDir = path.join(TEST_DIR, 'src');
//         const srcFile = path.join(srcDir, 'srcfile.css');
//         fse.outputFileSync(srcFile, 'src contents');
//         const destDir = path.join(TEST_DIR, 'dest');
//         const destFile = path.join(destDir, 'destfile.css');
//         const filter = (s: string) =>
//           path.extname(s) !== '.css' && !fs.statSync(s).isDirectory();

//         fse
//           .copy(srcFile, destFile, filter)
//           .catch(err => err)
//           .then(err => {
//             expect(err).toBeFalsy();
//             expect(!fs.existsSync(destDir)).toBeTruthy();
//             done();
//           });
//       });

//       it('should only copy files allowed by filter fn', done => {
//         const srcFile1 = path.join(TEST_DIR, '1.css');
//         fs.writeFileSync(srcFile1, '');
//         const destFile1 = path.join(TEST_DIR, 'dest1.css');
//         const filter = (s: string) => s.split('.').pop() !== 'css';

//         fse
//           .copy(srcFile1, destFile1, filter)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             expect(!fs.existsSync(destFile1)).toBeTruthy();
//             done();
//           });
//       });

//       it('should not call filter fn more than needed', done => {
//         const src = path.join(TEST_DIR, 'foo');
//         fs.writeFileSync(src, '');
//         const dest = path.join(TEST_DIR, 'bar');

//         let filterCallCount = 0;
//         const filter = () => {
//           filterCallCount++;
//           return true;
//         };

//         fse
//           .copy(src, dest, filter)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             expect(filterCallCount).toBe(1);
//             expect(fs.existsSync(dest)).toBeTruthy();
//             done();
//           });
//       });

//       it('accepts options object in place of filter', done => {
//         const srcFile1 = path.join(TEST_DIR, '1.jade');
//         fs.writeFileSync(srcFile1, '');
//         const destFile1 = path.join(TEST_DIR, 'dest1.jade');
//         const options = { filter: (s: string) => /.html$|.css$/i.test(s) };

//         fse
//           .copy(srcFile1, destFile1, options)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             expect(!fs.existsSync(destFile1)).toBeTruthy();
//             done();
//           });
//       });

//       it('allows filter fn to return a promise', done => {
//         const srcFile1 = path.join(TEST_DIR, '1.css');
//         fs.writeFileSync(srcFile1, '');
//         const destFile1 = path.join(TEST_DIR, 'dest1.css');
//         const filter = (s: string) =>
//           Promise.resolve(s.split('.').pop() !== 'css');

//         fse
//           .copy(srcFile1, destFile1, filter)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();
//             expect(!fs.existsSync(destFile1)).toBeTruthy();
//             done();
//           });
//       });

//       it('should apply filter recursively', done => {
//         const FILES = 2;
//         // Don't match anything that ends with a digit higher than 0:
//         const filter = (s: string) => /(0|\D)$/i.test(s);

//         const src = path.join(TEST_DIR, 'src');
//         fse.mkdirsSync(src);

//         for (let i = 0; i < FILES; ++i) {
//           fs.writeFileSync(
//             path.join(src, i.toString()),
//             crypto.randomBytes(SIZE),
//           );
//         }

//         const subdir = path.join(src, 'subdir');
//         fse.mkdirsSync(subdir);

//         for (let i = 0; i < FILES; ++i) {
//           fs.writeFileSync(
//             path.join(subdir, i.toString()),
//             crypto.randomBytes(SIZE),
//           );
//         }
//         const dest = path.join(TEST_DIR, 'dest');
//         fse
//           .copy(src, dest, filter)
//           .catch(err => err)
//           .then(err => {
//             expect(!err).toBeTruthy();

//             expect(fs.existsSync(dest)).toBeTruthy();
//             expect(FILES > 1).toBeTruthy();

//             for (let i = 0; i < FILES; ++i) {
//               if (i === 0) {
//                 expect(fs.existsSync(path.join(dest, i.toString()))).toBeTruthy();
//               } else {
//                 expect(!fs.existsSync(path.join(dest, i.toString()))).toBeTruthy();
//               }
//             }

//             const destSub = path.join(dest, 'subdir');

//             for (let j = 0; j < FILES; ++j) {
//               if (j === 0) {
//                 expect(fs.existsSync(path.join(destSub, j.toString()))).toBeTruthy();
//               } else {
//                 expect(!fs.existsSync(path.join(destSub, j.toString()))).toBeTruthy();
//               }
//             }
//             done();
//           });
//       });

//       it('should apply filter to directory names', done => {
//         const IGNORE = 'ignore';
//         const filter = (p: string | string[]) => !~p.indexOf(IGNORE);

//         const src = path.join(TEST_DIR, 'src');
//         fse.mkdirsSync(src);

//         const ignoreDir = path.join(src, IGNORE);
//         fse.mkdirsSync(ignoreDir);

//         fse.writeFileSync(
//           path.join(ignoreDir, 'file'),
//           crypto.randomBytes(SIZE),
//         );

//         const dest = path.join(TEST_DIR, 'dest');

//         fse
//           .copy(src, dest, filter)
//           .catch(err => err)
//           .then(err => {
//             expect(err).toBeFalsy();
//             expect(!fs.existsSync(path.join(dest, IGNORE))).toBeTruthy();
//             expect(!fs.existsSync(path.join(dest, IGNORE, 'file'))).toBeTruthy();
//             done();
//           });
//       });

//       it('should apply filter when it is applied only to dest', done => {
//         const timeCond = new Date().getTime();

//         const filter = (s: any, d: string) =>
//           fs.statSync(d).mtime.getTime() < timeCond;

//         const src = path.join(TEST_DIR, 'src');
//         fse.mkdirsSync(src);
//         const subdir = path.join(src, 'subdir');
//         fse.mkdirsSync(subdir);

//         const dest = path.join(TEST_DIR, 'dest');

//         setTimeout(() => {
//           fse.mkdirsSync(dest);

//           fse
//             .copy(src, dest, filter)
//             .catch(err => err)
//             .then(err => {
//               expect(!err).toBeTruthy();
//               expect(!fs.existsSync(path.join(dest, 'subdir'))).toBeTruthy();
//               done();
//             });
//         }, 1000);
//       });

//       it('should apply filter when it is applied to both src and dest', done => {
//         const timeCond = new Date().getTime();
//         const filter = (s: string, d: string) =>
//           s.split('.').pop() !== 'css' &&
//           fs.statSync(path.dirname(d)).mtime.getTime() > timeCond;

//         const dest = path.join(TEST_DIR, 'dest');
//         setTimeout(async () => {
//           fse.mkdirsSync(dest);

//           const srcFile1 = path.join(TEST_DIR, '1.html');
//           const srcFile2 = path.join(TEST_DIR, '2.css');
//           const srcFile3 = path.join(TEST_DIR, '3.jade');

//           fse.writeFileSync(srcFile1, '');
//           fse.writeFileSync(srcFile2, '');
//           fse.writeFileSync(srcFile3, '');

//           const destFile1 = path.join(dest, 'dest1.html');
//           const destFile2 = path.join(dest, 'dest2.css');
//           const destFile3 = path.join(dest, 'dest3.jade');

//           let err_1: any;
//           try {
//             err_1 = await fse.copy(srcFile1, destFile1, filter);
//           } catch (err) {
//             err_1 = err;
//           }
//           expect(!err_1).toBeTruthy();
//           expect(fs.existsSync(destFile1)).toBeTruthy();
//           fse
//             .copy(srcFile2, destFile2, filter)
//             .catch(err_2 => err_2)
//             .then(err_3 => {
//               expect(!err_3).toBeTruthy();
//               expect(!fs.existsSync(destFile2)).toBeTruthy();

//               fse
//                 .copy(srcFile3, destFile3, filter)
//                 .catch(err_4 => err_4)
//                 .then(err_5 => {
//                   expect(!err_5).toBeTruthy();
//                   expect(fs.existsSync(destFile3)).toBeTruthy();
//                   done();
//                 });
//             });
//         }, 100);
//       });
//     });
//   });
// });

it.todo(`bring back copy tests, they're hurting my brain lol`);

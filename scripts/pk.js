/**!
 * MIT License
 *
 * Copyright (c) 2023 Expo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Updates all package.json's
import fs from 'fs';

const searchDirs = ['packages'];

const basePkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
basePkg.scripts = {
  build: 'tsc',
  dev: 'nodemon --watch src -e ts,json,env --delay 50ms --exec "npm run build"',
};
basePkg.dependencies = {};
basePkg.devDependencies = Object.fromEntries(
  Object.entries(basePkg.devDependencies).filter(([k]) =>
    ['concurrently', 'nodemon', 'esbuild', '@3xpo/es-many'].includes(k),
  ),
);
basePkg.peerDependencies = {};
const copyFields = [
  // 'version',
  'author',
  'repository',
  'homepage',
  'bugs',
  'license',
  'type',
];
const copyFieldsIfNull = [
  'name',
  'description',
  'scripts',
  'contributors',
  'maintainers',
  'version',
  'dependencies',
  'devDependencies',
  'engines',
  'files',
];

const recReaddirSync = dir => {
  if (dir.endsWith('node_modules')) return [];
  return fs
    .readdirSync(dir)
    .map(f => dir + '/' + f)
    .flatMap(v => (fs.statSync(v).isDirectory() ? recReaddirSync(v) : v));
};

const pkgs = searchDirs
  .map(dir =>
    recReaddirSync(dir).filter(
      v => v.endsWith('package.json') && !v.includes('/node_modules/'),
    ),
  )
  .flat();

pkgs.forEach(pkgPath => {
  console.log(`Updating Package: ${pkgPath}`);

  // Get the file
  const pkgFile = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  // Patch the file
  Object.entries(basePkg).forEach(([k, v]) => {
    if (copyFields.includes(k)) pkgFile[k] = v;
    if (
      copyFieldsIfNull.includes(k) &&
      (typeof pkgFile[k] === 'undefined' || pkgFile[k] === null)
    )
      pkgFile[k] = v;
    if (k === 'repository' && pkgFile[k]) {
      pkgFile[k].directory = pkgPath.replace(/package.json/giu, '');
    } else if (k === 'homepage') {
      pkgFile.homepage = `${v}/${
        v.includes('github.com') ? 'blob' : 'src/branch'
      }/senpai/${pkgPath.replace(/package.json/giu, '')}`;
    }
  });

  // Ensure devDeps is at the bottom
  const devDeps = pkgFile.devDependencies;
  delete pkgFile.devDependencies;
  pkgFile.devDependencies = devDeps;

  // Write
  fs.writeFileSync(pkgPath, JSON.stringify(pkgFile, null, 2) + '\n');
});

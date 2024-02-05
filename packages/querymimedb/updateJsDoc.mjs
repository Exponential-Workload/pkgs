import { readFileSync, readdirSync, writeFileSync } from 'fs';

const jsSpaceDTs = readFileSync('dist/js-space.d.ts', 'utf-8');
const jsDoc = jsSpaceDTs
  .match(/\/\*\*[\s\S]+?\*\//g)
  .find(v => v.includes('@name Query'));
if (!jsDoc) {
  console.error(new Error('did not find jsdoc for @name Query!'));
  process.exit(0);
}

readdirSync('dist', { recursive: true }).forEach(v => {
  v = 'dist/' + v;
  writeFileSync(
    v,
    readFileSync(v, 'utf-8').replace(
      `/** See {@link QueryFunc Query} for information. */`,
      jsDoc.split(`import('./exceptions')`).join('exceptions'),
    ),
  );
});

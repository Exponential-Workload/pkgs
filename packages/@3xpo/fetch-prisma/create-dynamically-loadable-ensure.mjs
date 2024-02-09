import fs from 'fs';
import zlib from 'zlib';
fs.writeFileSync(
  'src/ensure-raw.ts',
  `import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';
export default zlib.brotliDecompressSync(Buffer.from(${JSON.stringify(zlib.brotliCompressSync(fs.readFileSync('src/ensure.js')).toString('base64'))},'base64')).toString('utf-8');
`,
);

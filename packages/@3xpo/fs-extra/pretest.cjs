const fseTestDir = require('path').join(require('os').tmpdir(), 'fs-extra');
require('fs').rmSync(fseTestDir, {
  recursive: true,
  force: true,
});
require('fs').mkdirSync(fseTestDir);

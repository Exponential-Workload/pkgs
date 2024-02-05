require('fs').rmSync(require('path').join(require('os').tmpdir(), 'fs-extra'), {
  recursive: true,
  force: true,
});

if (process.platform !== 'win32')
  require('fs').rmSync('/tmp/fs-extra', {
    recursive: true,
    force: true,
  });

// Import statements for ESM
import * as fs from 'graceful-fs';
import * as _fs from 'fs';
import { fromCallback } from '@3xpo/universalify';

// Export fs methods directly
export * from 'graceful-fs';

// Define the API with explicit types
export const access = fromCallback(
  fs.access ?? _fs.access,
) as typeof _fs.access.__promisify__ & typeof _fs.access;
export const appendFile = fromCallback(
  fs.appendFile ?? _fs.appendFile,
) as typeof _fs.appendFile.__promisify__ & typeof _fs.appendFile;
export const chmod = fromCallback(
  fs.chmod ?? _fs.chmod,
) as typeof _fs.chmod.__promisify__ & typeof _fs.chmod;
export const chown = fromCallback(
  fs.chown ?? _fs.chown,
) as typeof _fs.chown.__promisify__ & typeof _fs.chown;
export const close = fromCallback(
  fs.close ?? _fs.close,
) as typeof _fs.close.__promisify__ & typeof _fs.close;
export const copyFile = fromCallback(
  fs.copyFile ?? _fs.copyFile,
) as typeof _fs.copyFile.__promisify__ & typeof _fs.copyFile;
export const fchmod = fromCallback(
  fs.fchmod ?? _fs.fchmod,
) as typeof _fs.fchmod.__promisify__ & typeof _fs.fchmod;
export const fchown = fromCallback(
  fs.fchown ?? _fs.fchown,
) as typeof _fs.fchown.__promisify__ & typeof _fs.fchown;
export const fdatasync = fromCallback(
  fs.fdatasync ?? _fs.fdatasync,
) as typeof _fs.fdatasync.__promisify__ & typeof _fs.fdatasync;
export const fstat = fromCallback(
  fs.fstat ?? _fs.fstat,
) as typeof _fs.fstat.__promisify__ & typeof _fs.fstat;
export const fsync = fromCallback(
  fs.fsync ?? _fs.fsync,
) as typeof _fs.fsync.__promisify__ & typeof _fs.fsync;
export const ftruncate = fromCallback(
  fs.ftruncate ?? _fs.ftruncate,
) as typeof _fs.ftruncate.__promisify__ & typeof _fs.ftruncate;
export const futimes = fromCallback(
  fs.futimes ?? _fs.futimes,
) as typeof _fs.futimes.__promisify__ & typeof _fs.futimes;
export const lchmod = fromCallback(
  fs.lchmod ?? _fs.lchmod,
) as typeof _fs.lchmod.__promisify__ & typeof _fs.lchmod;
export const lchown = fromCallback(
  fs.lchown ?? _fs.lchown,
) as typeof _fs.lchown.__promisify__ & typeof _fs.lchown;
export const link = fromCallback(
  fs.link ?? _fs.link,
) as typeof _fs.link.__promisify__ & typeof _fs.link;
export const lstat = fromCallback(
  fs.lstat ?? _fs.lstat,
) as typeof _fs.lstat.__promisify__ & typeof _fs.lstat;
export const mkdir = fromCallback(
  fs.mkdir ?? _fs.mkdir,
) as typeof _fs.mkdir.__promisify__ & typeof _fs.mkdir;
export const mkdtemp = fromCallback(
  fs.mkdtemp ?? _fs.mkdtemp,
) as typeof _fs.mkdtemp.__promisify__ & typeof _fs.mkdtemp;
export const open = fromCallback(
  fs.open ?? _fs.open,
) as unknown as typeof _fs.open.__promisify__ & typeof _fs.open;
export const opendir = fromCallback(
  fs.opendir ?? _fs.opendir,
) as typeof _fs.opendir.__promisify__ & typeof _fs.opendir;
export const readdir = fromCallback(
  fs.readdir ?? _fs.readdir,
) as typeof _fs.readdir.__promisify__ & typeof _fs.readdir;
export const readFile = fromCallback(
  fs.readFile ?? _fs.readFile,
) as typeof _fs.readFile.__promisify__ & typeof _fs.readFile;
export const readlink = fromCallback(
  fs.readlink ?? _fs.readlink,
) as typeof _fs.readlink.__promisify__ & typeof _fs.readlink;
let _realpath = fromCallback(
  fs.realpath ?? _fs.realpath,
) as typeof _fs.realpath.__promisify__ &
  typeof _fs.realpath & {
    native(path: fs.PathLike, options?: fs.EncodingOption): Promise<string>;

    native(
      path: fs.PathLike,
      options: fs.BufferEncodingOption,
    ): Promise<Buffer>;
  };
export const rename = fromCallback(
  fs.rename ?? _fs.rename,
) as typeof _fs.rename.__promisify__ & typeof _fs.rename;
export const rm = fromCallback(fs.rm ?? _fs.rm) as typeof _fs.rm.__promisify__ &
  typeof _fs.rm;
export const rmdir = fromCallback(
  fs.rmdir ?? _fs.rmdir,
) as typeof _fs.rmdir.__promisify__ & typeof _fs.rmdir;
export const stat = fromCallback(
  fs.stat ?? _fs.stat,
) as typeof _fs.stat.__promisify__ & typeof _fs.stat;
export const symlink = fromCallback(
  fs.symlink ?? _fs.symlink,
) as typeof _fs.symlink.__promisify__ & typeof _fs.symlink;
export const truncate = fromCallback(
  fs.truncate ?? _fs.truncate,
) as typeof _fs.truncate.__promisify__ & typeof _fs.truncate;
export const unlink = fromCallback(
  fs.unlink ?? _fs.unlink,
) as typeof _fs.unlink.__promisify__ & typeof _fs.unlink;
export const utimes = fromCallback(
  fs.utimes ?? _fs.utimes,
) as typeof _fs.utimes.__promisify__ & typeof _fs.utimes;
export const writeFile = fromCallback(
  fs.writeFile ?? _fs.writeFile,
) as typeof _fs.writeFile.__promisify__ & typeof _fs.writeFile;

// Handling `exists`, `read`, `write`, `readv`, and `writev` specially due to their callback signatures
export const exists = (
  filename: string,
  callback?: (exists: boolean) => void,
): Promise<boolean> => {
  return new Promise<boolean>(resolve =>
    fs.exists(filename, rt => {
      callback?.(rt);
      resolve(rt);
    }),
  );
};

export const read = (
  fd: number,
  buffer: Buffer,
  offset: number,
  length: number,
  position?: number | null,
  callback?: (
    err: NodeJS.ErrnoException | null,
    bytesRead: number,
    buffer: Buffer,
  ) => void,
): Promise<{ bytesRead: number; buffer: Buffer }> => {
  const c = <P extends any>(v: Promise<P>) => {
    if (callback) v.catch(() => void 0);
    return v;
  };
  return c(
    new Promise((resolve, reject) => {
      fs.read(
        fd,
        buffer,
        offset,
        length,
        position,
        (err, bytesRead, buffer) => {
          if (callback) callback(err, bytesRead, buffer);
          if (err) reject(err);
          else resolve({ bytesRead, buffer });
        },
      );
    }),
  );
};

// i don't care anymore
export const write = (
  fd: number,
  buffer: Buffer | string,
  offsetOrPosition?: number | null,
  lengthOrEncoding?: number | string | null,
  positionOrCallback?:
    | number
    | null
    | ((
        err: NodeJS.ErrnoException | null,
        written: number,
        bufferOrString: string | Uint8Array,
      ) => void),
  callback?: (
    err: NodeJS.ErrnoException | null,
    written: number,
    bufferOrString: string | Uint8Array,
  ) => void,
): Promise<{ written: number; bufferOrString: string | Uint8Array }> => {
  if (typeof positionOrCallback === 'function') {
    return write(
      fd,
      buffer,
      offsetOrPosition,
      length,
      undefined,
      (err, written, bufferOrStr) => {
        positionOrCallback(err, written, bufferOrStr);
      },
    ) as never;
  } else if (typeof callback === 'function') {
    return write(
      fd,
      buffer as any,
      offsetOrPosition,
      lengthOrEncoding as any,
      positionOrCallback,
      undefined,
    )
      .then(v => {
        callback(null, v.written, v.bufferOrString);
        return v;
      })
      .catch(e => {
        callback(e, null, null);
        return null as never;
      });
  } else {
    return new Promise((resolve, reject) => {
      fs.write(
        fd,
        buffer as any,
        offsetOrPosition,
        lengthOrEncoding as number,
        positionOrCallback,
        (err, written, bufferOrString) => {
          if (err) reject(err);
          else resolve({ written, bufferOrString });
        },
      );
    });
  }
};
export const readv = (
  fd: number,
  buffers: NodeJS.ArrayBufferView[],
  position?: number | null,
  callback?: (
    err: NodeJS.ErrnoException | null,
    bytesRead: number,
    buffers: NodeJS.ArrayBufferView[],
  ) => void,
): Promise<{ bytesRead: number; buffers: NodeJS.ArrayBufferView[] }> => {
  const p = new Promise((resolve, reject) => {
    fs.readv(fd, buffers, position, (err, bytesRead, buffers) => {
      callback(err, bytesRead, buffers);
      if (err) reject(err);
      else resolve({ bytesRead, buffers });
    });
  });
  if (callback) p.catch(() => void 0); // prevent ending process
  return p as Promise<any>;
};
export const writev = (
  fd: number,
  buffers: NodeJS.ArrayBufferView[],
  position?: number | null,
  callback?: (
    err: NodeJS.ErrnoException | null,
    bytesWritten: number,
    buffers: NodeJS.ArrayBufferView[],
  ) => void,
): Promise<{
  bytesWritten: number;
  buffers: NodeJS.ArrayBufferView[];
}> => {
  const c = <P extends any>(v: Promise<P>) => {
    if (callback) v.catch(() => void 0);
    return v;
  };
  return c(
    new Promise((resolve, reject) => {
      fs.writev(fd, buffers, position, (err, bytesWritten, buffers) => {
        if (err) reject(err);
        else resolve({ bytesWritten, buffers });
      });
    }),
  );
};

// Handling fs.realpath.native, if available
if (typeof fs.realpath.native === 'function') {
  _realpath = {
    native: fromCallback(fs.realpath ?? _fs.realpath.native),
  } as any;
} else {
  process.emitWarning(
    'fs.realpath.native is not a function. Is fs being monkey-patched?',
    'Warning',
    'fs-extra-WARN0003',
  );
}

export const realpath = _realpath;

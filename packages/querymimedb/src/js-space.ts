import Addon from './addon';
import {
  NotFoundException,
  QueryException,
  NoLibMagicException,
  NoMagicDbException,
  NoTypeException,
} from './exceptions';

/**
 * @name Query
 * @description Queries a path's MIME type.
 * @throws {import('./exceptions').QueryException} When we don't know what happened
 * @throws {import('./exceptions').NoTypeException} When no MIME type was found
 * @throws {import('./exceptions').NotFoundException} When the file doesn't exist
 * @throws {import('./exceptions').NoMagicDbException} When the magicdb does not exist and {@link dieOnNoLibMagic} is true or undefined
 * @throws {import('./exceptions').NoLibMagicException} When libmagic is not installed and {@link dieOnNoLibMagic} is true or undefined
 * @param {string} path The path to query the mime type for
 * @param {boolean} [dieOnNoLibMagic=true] If libmagic isn't found & this is true or undefined, error.
 * @returns {string|null} The MIME Type. If libmagic failed to be imported, or the magic db doesn't exist, returns null when {@link dieOnNoLibMagic} is false, and throws a {@link import('./exceptions').NoLibMagicException NoLibMagicException} or {@link import('./exceptions').NoMagicDbException NoMagicDbException} if it's true or blank.
 */
export type QueryFunc = <DieOnNoLibMagic extends boolean = true>(
  path: string,
  dieOnNoLibMagic?: DieOnNoLibMagic,
) => DieOnNoLibMagic extends true ? string : string | null;

/** JS-Space Wrapper Function; takes the Node API (imported via CJS or ESM), and outputs a callable function that properly returns errors */
export default (addon: Addon): QueryFunc =>
  <DieOnNoLibMagic extends boolean = true>(
    path: string,
    dieOnNoLibMagic: DieOnNoLibMagic = true as DieOnNoLibMagic,
  ): DieOnNoLibMagic extends true ? string : string | null => {
    const result = addon.queryMimeType(path);
    if (result.startsWith('ERR_')) {
      // We need to throw some error here (or libmagic doesnt exist)
      switch (result) {
        case 'ERR_ENOENT':
          throw new NotFoundException(
            `File ${JSON.stringify(path)} was not found.`,
            result,
          );

        case 'ERR_NOT_BUILT_WITH_LIBMAGIC':
          if (dieOnNoLibMagic)
            throw new NoLibMagicException(
              `Package was not built with libmagic; see the README. Pass \`false\` as the 2nd arg to silence and have us return null, so you can handle the query yourself when we can't handle it.`,
              result,
            );
          else return null;

        case 'ERR_NO_LIBMAGIC':
          if (dieOnNoLibMagic)
            throw new NoLibMagicException(
              `Libmagic is not installed on this system. Pass \`false\` as the 2nd arg to silence and have us return null, so you can handle the query yourself when we can't handle it.`,
              result,
            );
          else return null;

        case 'ERR_NO_MAGIC_DB':
          if (dieOnNoLibMagic)
            throw new NoMagicDbException(
              `There's no magic db on this system. Pass \`false\` as the 2nd arg to silence and have us return null, so you can handle the query yourself when we can't handle it.`,
              result,
            );
          else return null;

        case 'ERR_CANNOT_FIND_MIME_TYPE':
          throw new NoTypeException(
            `MIME type for ${JSON.stringify(path)} was not found.`,
            result,
          );

        default:
          throw new QueryException(`Unknown Native Error: ${result}`, result);
      }
    } else {
      // The result was OK, we can return it.
      return result;
    }
  };

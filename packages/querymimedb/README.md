# querymimedb

Query the MIME DB on systems that support it.

Essentially equivalent to `file --mime-type`, but faster, as we don't spawn an additional process.

This will fail when:
(a) the file does not have any known filetype;
(b) the system doesn't have a mime type

See JSDocs for more info. We recommend falling back to a traditional filepath-based solution, such as [mime-types](https://npm.im/mime-types).

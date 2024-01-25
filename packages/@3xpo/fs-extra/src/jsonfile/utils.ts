export type StringifyOptions = {
  EOL?: string | undefined;
  finalEOL?: boolean | undefined;
  replacer?: null | undefined;
  spaces: any;
};
export const stringify = (
  obj: any,
  {
    EOL = '\n',
    finalEOL = true,
    replacer = null,
    spaces,
  }: Partial<StringifyOptions> = {},
) => {
  const EOF = finalEOL ? EOL : '';
  const str = JSON.stringify(obj, replacer, spaces);

  return str.replace(/\n/g, EOL) + EOF;
};

export const stripBom = (content: Buffer | string) => {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8');
  return content.replace(/^\uFEFF/, '');
};

module.exports = { stringify, stripBom };

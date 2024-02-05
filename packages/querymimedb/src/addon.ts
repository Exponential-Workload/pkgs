/** The raw node-native addon */
export type Addon = {
  /**
   * Raw Node Addon; does not throw errors for anything except no path being inputted. Returns strings beginning in `ERR_` when you should throw something in JS land.
   * Returned strings are stable across package minor versions
   */
  queryMimeType: (path: string) => string;
};
export default Addon;

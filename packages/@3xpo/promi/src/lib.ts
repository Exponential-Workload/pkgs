type Falsey = null | undefined | false | '';
/** Converts an array to a single item if it's the only item in there, otherwise returns the array */
export type SmartArray<T extends [...any]> = T extends [any] ? T[0] : T;
export const SmartArray = <T extends [...any]>(array: T) =>
  (array.length === 1 ? array[0] : array) as SmartArray<T>;
type WrappableFunction = Parameters<typeof Promi.wrap>[0];
export default class Promi {
  /** Just wraps the function into a promise, returning its exact cb args */
  public static wrapPromise<
    CallbackArgs extends any[],
    FunctionArgsExclCallback extends [...any],
  >(
    func: (
      ...args: [...FunctionArgsExclCallback, cb: (...args: CallbackArgs) => any]
    ) => void,
  ) {
    return (...args: FunctionArgsExclCallback) =>
      // @ts-ignore
      new Promise<CallbackArgs>(rs => func(...args, (...cbArgs) => rs(cbArgs)));
  }
  /** Wraps & Calls a function - See: {@link wrapPromise} */
  public static callPromise = <
    CallbackArgs extends any[],
    FunctionArgsExclCallback extends [...any],
  >(
    func: (
      ...args: [...FunctionArgsExclCallback, cb: (...args: CallbackArgs) => any]
    ) => void,
    ...args: FunctionArgsExclCallback
  ) => this.wrapPromise(func)(...args);
  /** Wraps the function, taking the first callback arg as an error (which gets thrown if not falsey), and the rest as the return value. Returns an array of values if more than one argument is present, otherwise just returns the argument */
  public static wrap<
    CallbackArgsExclError extends any[],
    FunctionArgsExclCallback extends [...any],
    ErrType = Error,
  >(
    func: (
      ...args: [
        ...FunctionArgsExclCallback,
        cb: (error: ErrType | Falsey, ...args: CallbackArgsExclError) => any,
      ]
    ) => void,
  ) {
    const wrapped = this.wrapPromise(func);
    return (...args: FunctionArgsExclCallback) =>
      wrapped(...args).then(v => {
        const err = v.shift();
        if (err) throw err;
        else
          return SmartArray(
            v as unknown as CallbackArgsExclError /* we shifted */,
          );
      });
  }
  /** Wraps & Calls a function - See: {@link wrap} */
  public static call = <
    CallbackArgsExclError extends any[],
    FunctionArgsExclCallback extends [...any],
    ErrType = Error,
  >(
    func: (
      ...args: [
        ...FunctionArgsExclCallback,
        cb: (error: ErrType | Falsey, ...args: CallbackArgsExclError) => any,
      ]
    ) => void,
    ...args: FunctionArgsExclCallback
  ) => this.wrap(func)(...args);
}
export const wrap = <Func extends WrappableFunction>(f: Func) => Promi.wrap(f);
export const call = <Func extends WrappableFunction>(f: Func) => Promi.call(f);
